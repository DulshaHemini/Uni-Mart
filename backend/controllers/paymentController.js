import crypto from "crypto";
import Order from "../models/Order.js";
import Payment from "../models/Payment.js";
import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";


// ================================
// GENERATE PAYHERE HASH
// ================================

export const generatePayHereHash = async (req, res) => {

    try {

        const {
            order_id,
            amount
        } = req.body;


        if (!order_id || amount === undefined) {

            return res.status(400).json({
                message: "Order ID and amount are required"
            });

        }


        const merchantId =
            process.env.PAYHERE_MERCHANT_ID;

        const merchantSecret =
            process.env.PAYHERE_MERCHANT_SECRET;


        if (!merchantId || !merchantSecret) {

            return res.status(500).json({
                message: "PayHere credentials are not configured"
            });

        }


        // PayHere requires exactly 2 decimal places
        const formattedAmount =
            Number(amount).toFixed(2);


        const currency = "LKR";


        // MD5 merchant secret
        const hashedSecret =
            crypto
                .createHash("md5")
                .update(merchantSecret)
                .digest("hex")
                .toUpperCase();


        // Final PayHere hash
        const hash =
            crypto
                .createHash("md5")
                .update(
                    merchantId +
                    order_id +
                    formattedAmount +
                    currency +
                    hashedSecret
                )
                .digest("hex")
                .toUpperCase();


        return res.status(200).json({

            message:
                "PayHere hash generated successfully",

            merchant_id:
                merchantId,

            order_id,

            amount:
                formattedAmount,

            currency,

            hash

        });


    } catch (error) {

        console.error(
            "Generate PayHere Hash Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to generate PayHere hash"
        });

    }

};


export const handlePayHereNotification = async (req, res) => {

    try {

        const {
            merchant_id,
            order_id,
            payment_id,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
            method,
            status_message
        } = req.body;


        // ================================
        // VALIDATE REQUIRED DATA
        // ================================

        if (
            !merchant_id ||
            !order_id ||
            !payhere_amount ||
            !payhere_currency ||
            status_code === undefined ||
            !md5sig
        ) {

            return res
                .status(400)
                .send(
                    "Missing PayHere notification fields"
                );

        }


        const merchantSecret =
            process.env.PAYHERE_MERCHANT_SECRET;


        if (!merchantSecret) {

            return res
                .status(500)
                .send(
                    "Merchant secret not configured"
                );

        }


        // ================================
        // VERIFY MERCHANT ID
        // ================================

        if (
            merchant_id !==
            process.env.PAYHERE_MERCHANT_ID
        ) {

            return res
                .status(400)
                .send(
                    "Invalid merchant ID"
                );

        }


        // ================================
        // HASH MERCHANT SECRET
        // ================================

        const hashedSecret =
            crypto
                .createHash("md5")
                .update(
                    merchantSecret
                )
                .digest("hex")
                .toUpperCase();


        // ================================
        // GENERATE LOCAL SIGNATURE
        // ================================

        const localMd5Sig =
            crypto
                .createHash("md5")
                .update(
                    merchant_id +
                    order_id +
                    payhere_amount +
                    payhere_currency +
                    status_code +
                    hashedSecret
                )
                .digest("hex")
                .toUpperCase();


        // ================================
        // VERIFY SIGNATURE
        // ================================

        if (
            localMd5Sig !==
            String(md5sig).toUpperCase()
        ) {

            console.log(
                "Invalid PayHere signature"
            );


            return res
                .status(400)
                .send(
                    "Invalid payment signature"
                );

        }


        // ================================
        // FIND ORDER
        // ================================

        const order =
            await Order.findOne({
                order_code:
                    order_id
            });


        if (!order) {

            console.log(
                "Order not found:",
                order_id
            );


            return res
                .status(404)
                .send(
                    "Order not found"
                );

        }


        // ================================
        // VERIFY AMOUNT
        // ================================

        const expectedAmount =
            Number(
                order.total_amount
            ).toFixed(2);


        const receivedAmount =
            Number(
                payhere_amount
            ).toFixed(2);


        if (
            expectedAmount !==
            receivedAmount
        ) {

            console.log(
                "Payment amount mismatch"
            );


            return res
                .status(400)
                .send(
                    "Payment amount mismatch"
                );

        }


        // ================================
        // VERIFY CURRENCY
        // ================================

        if (
            payhere_currency !==
            "LKR"
        ) {

            return res
                .status(400)
                .send(
                    "Invalid payment currency"
                );

        }


        // ================================
        // FIND PAYMENT
        // ================================

        const payment =
            await Payment.findOne({
                order_id:
                    order._id
            });


        if (!payment) {

            return res
                .status(404)
                .send(
                    "Payment record not found"
                );

        }


        // ================================
        // SET PAYHERE PAYMENT ID
        // ================================

        payment.payhere_payment_id =
            payment_id || "";



        // ================================
        // HANDLE PAYMENT STATUS
        // ================================

        const status =
            String(status_code);


        // SUCCESS
        if (status === "2") {

            payment.payment_status =
                "success";

            order.order_status =
                "paid";


            // ================================
            // CLEAR BUYER CART
            // ================================

            const cart =
                await Cart.findOne({
                    user_id:
                        order.user_id
                });


            if (cart) {

                await CartItem.deleteMany({
                    cart_id:
                        cart._id
                });

            }

        }


        // PENDING
        else if (status === "0") {

            payment.payment_status =
                "pending";

            order.order_status =
                "pending";

        }


        // CANCELLED
        else if (status === "-1") {

            payment.payment_status =
                "cancelled";

            order.order_status =
                "cancelled";

        }


        // FAILED
        else if (status === "-2") {

            payment.payment_status =
                "failed";

            order.order_status =
                "failed";

        }


        // CHARGEBACK
        else if (status === "-3") {

            payment.payment_status =
                "chargedback";

            order.order_status =
                "failed";

        }


        else {

            return res
                .status(400)
                .send(
                    "Unknown payment status"
                );

        }


        // ================================
        // SAVE CHANGES
        // ================================

        await payment.save();

        await order.save();


        console.log(
            "PayHere Payment Updated:",
            {
                order_id:
                    order.order_code,

                payment_id,

                payment_status:
                    payment.payment_status,

                order_status:
                    order.order_status,

                method,

                status_message
            }
        );


        return res
            .status(200)
            .send(
                "Payment notification processed"
            );


    } catch (error) {

        console.error(
            "PayHere Notification Error:",
            error
        );


        return res
            .status(500)
            .send(
                "Payment notification failed"
            );

    }

};
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Payment from "../models/Payment.js";

import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";


// ================================
// CREATE ORDER FROM CART
// ================================

export const createOrder = async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const {
            shipping_address,
            shipping_city,
            shipping_postal_code,

            billing_address,
            billing_city,
            billing_postal_code,

            phone_number
        } = req.body;


        // ================================
        // VALIDATION
        // ================================

        if (
            !shipping_address ||
            !shipping_city ||
            !shipping_postal_code ||
            !billing_address ||
            !billing_city ||
            !billing_postal_code ||
            !phone_number
        ) {

            return res.status(400).json({
                message:
                    "Complete shipping and billing details are required"
            });

        }


        // ================================
        // GET BUYER CART
        // ================================

        const cart =
            await Cart.findOne({
                user_id: userId
            });


        if (!cart) {

            return res.status(400).json({
                message: "Cart not found"
            });

        }


        // ================================
        // GET CART ITEMS
        // ================================

        const cartItems =
            await CartItem
                .find({
                    cart_id: cart._id
                })
                .populate("product_id");


        if (cartItems.length === 0) {

            return res.status(400).json({
                message: "Your cart is empty"
            });

        }


        // ================================
        // CALCULATE TOTAL ON BACKEND
        // ================================

        let totalAmount = 0;


        for (const item of cartItems) {

            const product =
                item.product_id;


            if (!product) {

                return res.status(400).json({
                    message:
                        "A product in your cart no longer exists"
                });

            }


            if (
                product.stock_quantity <
                item.quantity
            ) {

                return res.status(400).json({
                    message:
                        `Insufficient stock for ${product.product_name}`
                });

            }


            totalAmount +=
                Number(product.price) *
                Number(item.quantity);

        }


        totalAmount =
            Number(
                totalAmount.toFixed(2)
            );


        // ================================
        // CREATE ORDER CODE
        // ================================

        const orderCode =
            `UNI${Date.now()}`;


        // ================================
        // CREATE ORDER
        // ================================

        const order =
            await Order.create({

                user_id:
                    userId,

                order_code:
                    orderCode,


                shipping_address,
                shipping_city,
                shipping_postal_code,


                billing_address,
                billing_city,
                billing_postal_code,


                phone_number,


                total_amount:
                    totalAmount,

                order_status:
                    "pending"

            });


        // ================================
        // CREATE ORDER ITEMS
        // ================================

        const orderItems =
            cartItems.map(
                (item) => {

                    const product =
                        item.product_id;


                    const price =
                        Number(
                            product.price
                        );


                    const quantity =
                        Number(
                            item.quantity
                        );


                    return {

                        order_id:
                            order._id,

                        product_id:
                            product._id,

                        quantity,

                        price,

                        subtotal:
                            Number(
                                (
                                    price *
                                    quantity
                                ).toFixed(2)
                            )

                    };

                }
            );


        await OrderItem.insertMany(
            orderItems
        );


        // ================================
        // CREATE PENDING PAYMENT
        // ================================

        const payment =
            await Payment.create({

                order_id:
                    order._id,

                payment_method:
                    "PayHere",

                payment_status:
                    "pending",

                amount:
                    totalAmount

            });


        // ================================
        // RESPONSE
        // ================================

        return res.status(201).json({

            message:
                "Order created successfully",

            order: {

                _id:
                    order._id,

                order_code:
                    order.order_code,

                total_amount:
                    order.total_amount,

                order_status:
                    order.order_status

            },

            payment: {

                _id:
                    payment._id,

                payment_status:
                    payment.payment_status

            }

        });


    } catch (error) {

        console.error(
            "Create Order Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to create order"
        });

    }

};

// ================================
// GET ORDER BY ORDER CODE
// ================================

export const getOrderByCode = async (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const {
            orderCode
        } = req.params;


        // ================================
        // FIND ORDER
        // ================================

        const order =
            await Order.findOne({
                order_code:
                    orderCode,
                user_id:
                    userId
            });


        if (!order) {

            return res.status(404).json({
                message:
                    "Order not found"
            });

        }


        

        // ================================
        // FIND ORDER ITEMS
        // ================================

        const orderItems =
            await OrderItem
                .find({
                    order_id:
                        order._id
                })
                .populate(
                    "product_id",
                    "product_name image"
                );


        // ================================
        // FIND PAYMENT
        // ================================

        const payment =
            await Payment.findOne({
                order_id:
                    order._id
            });


        // ================================
        // RESPONSE
        // ================================

        return res.status(200).json({

            message:
                "Order retrieved successfully",

            order: {

                _id:
                    order._id,

                order_code:
                    order.order_code,

                shipping_address:
                    order.shipping_address,

                shipping_city:
                    order.shipping_city,

                shipping_postal_code:
                    order.shipping_postal_code,

                total_amount:
                    order.total_amount,

                order_status:
                    order.order_status,

                created_at:
                    order.created_at

            },


            items:
                orderItems,


            payment:
                payment
                    ? {
                        payment_method:
                            payment.payment_method,

                        payment_status:
                            payment.payment_status,

                        payhere_payment_id:
                            payment.payhere_payment_id,

                        amount:
                            payment.amount
                    }
                    : null

        });


    } catch (error) {

        console.error(
            "Get Order Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to retrieve order"
        });

    }

};


// ================================
// GET LOGGED-IN SELLER ORDERS
// ================================

export const getSellerOrders = async (req, res) => {

    try {

        const sellerId =
            req.user.user_id;


        // Only sellers can access this

        if (req.user.role !== "seller") {

            return res.status(403).json({
                message:
                    "Seller access only"
            });

        }


        // ================================
        // GET SELLER PRODUCTS
        // ================================

        const sellerProducts =
            await Product.find({
                seller_id: sellerId
            }).select("_id");


        const productIds =
            sellerProducts.map(
                (product) =>
                    product._id
            );


        // Seller has no products yet

        if (productIds.length === 0) {

            return res.status(200).json({
                message:
                    "Seller orders retrieved successfully",
                orders: []
            });

        }


        // ================================
        // GET ORDER ITEMS FOR SELLER
        // ================================

        const sellerOrderItems =
            await OrderItem.find({

                product_id: {
                    $in: productIds
                }

            })
                .populate(
                    "product_id",
                    "product_name image price"
                );


        if (
            sellerOrderItems.length === 0
        ) {

            return res.status(200).json({
                message:
                    "Seller orders retrieved successfully",
                orders: []
            });

        }


        // ================================
        // GROUP ITEMS BY ORDER
        // ================================

        const groupedItems = {};


        sellerOrderItems.forEach(
            (item) => {

                const orderId =
                    item.order_id.toString();


                if (!groupedItems[orderId]) {

                    groupedItems[orderId] = [];

                }


                groupedItems[orderId].push(
                    item
                );

            }
        );


        const orderIds =
            Object.keys(
                groupedItems
            );


        // ================================
        // GET ORDERS
        // ================================

        const orders =
            await Order.find({

                _id: {
                    $in: orderIds
                }

            })
                .populate(
                    "user_id",
                    "first_name last_name email"
                )
                .sort({
                    created_at: -1
                });


        // ================================
        // FORMAT RESPONSE
        // ================================

        const result =
            orders.map(
                (order) => {

                    const items =
                        groupedItems[
                            order._id.toString()
                        ] || [];


                    const sellerTotal =
                        items.reduce(
                            (
                                total,
                                item
                            ) => {

                                return (
                                    total +
                                    Number(
                                        item.subtotal
                                    )
                                );

                            },
                            0
                        );


                    return {

                        _id:
                            order._id,

                        order_code:
                            order.order_code,

                        order_status:
                            order.order_status,

                        created_at:
                            order.created_at,


                        buyer: order.user_id
                            ? {

                                first_name:
                                    order.user_id.first_name,

                                last_name:
                                    order.user_id.last_name,

                                email:
                                    order.user_id.email

                            }
                            : null,


                        shipping: {

                            address:
                                order.shipping_address,

                            city:
                                order.shipping_city,

                            postal_code:
                                order.shipping_postal_code,

                            phone_number:
                                order.phone_number

                        },


                        items,


                        seller_total:
                            Number(
                                sellerTotal.toFixed(2)
                            )

                    };

                }
            );


        return res.status(200).json({

            message:
                "Seller orders retrieved successfully",

            orders: result

        });


    } catch (error) {

        console.error(
            "Get Seller Orders Error:",
            error
        );


        return res.status(500).json({

            message:
                "Failed to retrieve seller orders"

        });

    }

};


// ================================
// GET LOGGED-IN USER ORDERS
// ================================

export const getMyOrders = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const orders = await Order.find({
            user_id: userId
        }).sort({
            created_at: -1
        });

        const result = await Promise.all(

            orders.map(async (order) => {

                const items = await OrderItem.find({
                    order_id: order._id
                }).populate(
                    "product_id",
                    "product_name image"
                );

                const payment = await Payment.findOne({
                    order_id: order._id
                });

                return {
                    _id: order._id,
                    order_code: order.order_code,
                    total_amount: order.total_amount,
                    order_status: order.order_status,
                    created_at: order.created_at,
                    items: items,
                    payment: payment
                        ? {
                            payment_status: payment.payment_status,
                            payment_method: payment.payment_method
                        }
                        : null
                };
            })

        );

        return res.status(200).json({
            message: "Orders retrieved successfully",
            orders: result
        });

    } catch (error) {

        console.error(
            "Get My Orders Error:",
            error
        );

        return res.status(500).json({
            message: "Failed to retrieve orders"
        });
    }
};
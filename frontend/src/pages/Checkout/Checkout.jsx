import {
    useEffect,
    useState
} from "react";

import { Link } from "react-router-dom";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import Notification from "../../components/Notification.jsx";

import "../../styles/Checkout/Checkout.css";


export default function Checkout() {

    const token =
        localStorage.getItem("token");


    // ================================
    // CUSTOMER / ADDRESS FORM
    // ================================

    const [formData, setFormData] =
        useState({

            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",

            shipping_address: "",
            shipping_city: "",
            shipping_postal_code: "",

            billing_address: "",
            billing_city: "",
            billing_postal_code: ""

        });


    const [sameAsShipping, setSameAsShipping] =
        useState(true);


    // ================================
    // CART
    // ================================

    const [cartItems, setCartItems] =
        useState([]);


    const [total, setTotal] =
        useState(0);


    // ================================
    // PAGE STATES
    // ================================

    const [loading, setLoading] =
        useState(true);


    const [notification, setNotification] =
        useState(null);



    // ================================
    // SHOW NOTIFICATION
    // ================================

    const showNotification = (
        type,
        message
    ) => {

        setNotification({
            type,
            message
        });


        setTimeout(() => {

            setNotification(null);

        }, 2500);

    };



    // ================================
    // LOAD PROFILE + CART
    // ================================

    useEffect(() => {
        let isActive = true;

        const loadCheckoutData = async () => {
            if (!token) {
                showNotification(
                    "error",
                    "Your session is missing or expired. Please log in again."
                );
                setLoading(false);
                return;
            }

            try {
                // Load the logged-in user's profile.
                const profileResponse = await fetch(
                    "http://localhost:5000/api/users/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const profileData = await profileResponse.json().catch(() => ({}));

                if (!profileResponse.ok) {
                    if (profileResponse.status === 401) {
                        throw new Error(
                            "Your login session is invalid or expired. Please log in again."
                        );
                    }

                    throw new Error(
                        profileData.message || "Failed to load profile"
                    );
                }

                // Load the user's cart.
                const cartResponse = await fetch(
                    "http://localhost:5000/api/cart",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const cartData = await cartResponse.json().catch(() => ({}));

                if (!cartResponse.ok) {
                    if (cartResponse.status === 401) {
                        throw new Error(
                            "Your login session is invalid or expired. Please log in again."
                        );
                    }

                    throw new Error(
                        cartData.message || "Failed to load cart"
                    );
                }

                if (!isActive) return;

                const user = profileData.user || {};

                setFormData({
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone_number: user.phone_number || "",
                    shipping_address: user.shipping_address || "",
                    shipping_city: user.shipping_city || "",
                    shipping_postal_code: user.shipping_postal_code || "",
                    billing_address:
                        user.billing_address || user.shipping_address || "",
                    billing_city:
                        user.billing_city || user.shipping_city || "",
                    billing_postal_code:
                        user.billing_postal_code || user.shipping_postal_code || ""
                });

                setCartItems(cartData.items || []);
                setTotal(Number(cartData.total || 0));
            } catch (error) {
                if (isActive) {
                    showNotification(
                        "error",
                        error.message || "Failed to load checkout information"
                    );
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        loadCheckoutData();

        return () => {
            isActive = false;
        };
    }, [token]);



    // ================================
    // INPUT CHANGE
    // ================================

    const handleChange = (
        event
    ) => {

        const {
            name,
            value
        } = event.target;


        setFormData(
            (previousData) => {

                const updatedData = {

                    ...previousData,

                    [name]: value

                };


                if (sameAsShipping) {

                    if (
                        name ===
                        "shipping_address"
                    ) {

                        updatedData.billing_address =
                            value;

                    }


                    if (
                        name ===
                        "shipping_city"
                    ) {

                        updatedData.billing_city =
                            value;

                    }


                    if (
                        name ===
                        "shipping_postal_code"
                    ) {

                        updatedData.billing_postal_code =
                            value;

                    }

                }


                return updatedData;

            }
        );

    };



    // ================================
    // SAME AS SHIPPING
    // ================================

    const handleSameAsShipping =
        (event) => {

            const checked =
                event.target.checked;


            setSameAsShipping(
                checked
            );


            if (checked) {

                setFormData(
                    (previousData) => ({

                        ...previousData,

                        billing_address:
                            previousData.shipping_address,

                        billing_city:
                            previousData.shipping_city,

                        billing_postal_code:
                            previousData.shipping_postal_code

                    })
                );

            }

        };



    // ================================
    // PAY NOW
    // ================================

    const handlePayNow = async (event) => {

    event.preventDefault();

    if (!token) {
        showNotification(
            "error",
            "Your session is missing or expired. Please log in again."
        );
        return;
    }


    // ================================
    // VALIDATE CUSTOMER DETAILS
    // ================================

    if (
        !formData.first_name ||
        !formData.last_name ||
        !formData.email ||
        !formData.phone_number ||
        !formData.shipping_address ||
        !formData.shipping_city ||
        !formData.shipping_postal_code
    ) {

        showNotification(
            "error",
            "Please complete all required checkout details"
        );

        return;

    }


    // ================================
    // VALIDATE BILLING DETAILS
    // ================================

    if (!sameAsShipping) {

        if (
            !formData.billing_address ||
            !formData.billing_city ||
            !formData.billing_postal_code
        ) {

            showNotification(
                "error",
                "Please complete your billing address details"
            );

            return;

        }

    }


    // ================================
    // VALIDATE CART
    // ================================

    if (cartItems.length === 0) {

        showNotification(
            "error",
            "Your cart is empty"
        );

        return;

    }


    try {

        // ================================
        // 1. CREATE ORDER IN MONGODB
        // ================================

        const orderResponse =
            await fetch(
                "http://localhost:5000/api/orders",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        shipping_address:
                            formData.shipping_address,

                        shipping_city:
                            formData.shipping_city,

                        shipping_postal_code:
                            formData.shipping_postal_code,


                        billing_address:
                            sameAsShipping
                                ? formData.shipping_address
                                : formData.billing_address,

                        billing_city:
                            sameAsShipping
                                ? formData.shipping_city
                                : formData.billing_city,

                        billing_postal_code:
                            sameAsShipping
                                ? formData.shipping_postal_code
                                : formData.billing_postal_code,


                        phone_number:
                            formData.phone_number

                    })
                }
            );


        const orderData =
            await orderResponse.json();


        if (!orderResponse.ok) {

            throw new Error(
                orderData.message ||
                "Failed to create order"
            );

        }


        // IMPORTANT:
        // Use the order code created by MongoDB/backend

        const orderId =
            orderData.order.order_code;


        const orderTotal =
            Number(
                orderData.order.total_amount
            );


        // ================================
        // 2. GENERATE PAYHERE HASH
        // ================================

        const hashResponse =
            await fetch(
                "http://localhost:5000/api/payments/payhere/hash",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        order_id:
                            orderId,

                        amount:
                            orderTotal
                    })
                }
            );


        const paymentData =
            await hashResponse.json();


        if (!hashResponse.ok) {

            throw new Error(
                paymentData.message ||
                "Failed to prepare PayHere payment"
            );

        }


        // ================================
        // 3. CREATE PAYHERE FORM
        // ================================

        const form =
            document.createElement(
                "form"
            );


        form.method =
            "POST";


        form.action =
            "https://sandbox.payhere.lk/pay/checkout";


        // ================================
        // 4. PAYHERE DATA
        // ================================

        const payHereData = {

            merchant_id:
                paymentData.merchant_id,


            
        return_url:
            `http://localhost:5173/order-confirmation?order_id=${orderId}`,

            cancel_url:
                `http://localhost:5173/payment-cancel?order_id=${orderId}`,

            notify_url:
    "https://glazing-pastor-abdomen.ngrok-free.dev/api/payments/payhere/notify",
            order_id:
                orderId,


            items:
                cartItems
                    .map(
                        (item) =>
                            item.product_id
                                ?.product_name
                    )
                    .filter(Boolean)
                    .join(", "),


            currency:
                paymentData.currency,


            amount:
                paymentData.amount,


            first_name:
                formData.first_name,

            last_name:
                formData.last_name,

            email:
                formData.email,

            phone:
                formData.phone_number,


            address:
                formData.shipping_address,

            city:
                formData.shipping_city,

            country:
                "Sri Lanka",


            hash:
                paymentData.hash

        };


        // ================================
        // 5. CREATE HIDDEN INPUTS
        // ================================

        Object.entries(
            payHereData
        ).forEach(
            ([key, value]) => {

                const input =
                    document.createElement(
                        "input"
                    );


                input.type =
                    "hidden";


                input.name =
                    key;


                input.value =
                    value ?? "";


                form.appendChild(
                    input
                );

            }
        );


        // ================================
        // 6. SUBMIT TO PAYHERE
        // ================================

        document.body.appendChild(
            form
        );


        form.submit();


    } catch (error) {

        showNotification(
            "error",
            error.message
        );

    }

};



    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (

            <>

                <BuyerNavbar />


                <main className="checkout-page">

                    <div className="checkout-container">

                        <p>
                            Loading checkout...
                        </p>

                    </div>

                </main>


                <Footer />

            </>

        );

    }



    // ================================
    // PAGE
    // ================================

    return (

        <>

            <BuyerNavbar />


            <main className="checkout-page">

                <div className="checkout-container">


                    {/* BREADCRUMB */}

                    <div className="checkout-breadcrumb">

                        <Link to="/buyer">
                            Home
                        </Link>

                        <span>›</span>

                        <Link to="/cart">
                            Cart
                        </Link>

                        <span>›</span>

                        <strong>
                            Checkout
                        </strong>

                    </div>



                    {/* HEADER */}

                    <div className="checkout-header">

                        <h1>
                            Checkout
                        </h1>

                        <p>
                            Complete your details
                            and proceed to payment.
                        </p>

                    </div>



                    <form
                        onSubmit={
                            handlePayNow
                        }
                    >

                        <div className="checkout-layout">



                            {/* =========================
                                LEFT SIDE
                            ========================= */}

                            <div className="checkout-left">



                                {/* CUSTOMER DETAILS */}

                                <section className="checkout-card">

                                    <h2>
                                        Customer Details
                                    </h2>


                                    <div className="checkout-row">


                                        <div className="checkout-field">

                                            <label>
                                                First Name *
                                            </label>

                                            <input
                                                type="text"
                                                name="first_name"
                                                value={
                                                    formData.first_name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label>
                                                Last Name *
                                            </label>

                                            <input
                                                type="text"
                                                name="last_name"
                                                value={
                                                    formData.last_name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                    </div>


                                    <div className="checkout-row">


                                        <div className="checkout-field">

                                            <label>
                                                Email *
                                            </label>

                                            <input
                                                type="email"
                                                name="email"
                                                value={
                                                    formData.email
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label>
                                                Phone Number *
                                            </label>

                                            <input
                                                type="text"
                                                name="phone_number"
                                                value={
                                                    formData.phone_number
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                    </div>

                                </section>



                                {/* SHIPPING ADDRESS */}

                                <section className="checkout-card">

                                    <h2>
                                        Shipping Address
                                    </h2>


                                    <div className="checkout-field">

                                        <label>
                                            Address *
                                        </label>

                                        <textarea
                                            name="shipping_address"
                                            value={
                                                formData.shipping_address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="4"
                                            required
                                        />

                                    </div>


                                    <div className="checkout-row">


                                        <div className="checkout-field">

                                            <label>
                                                City *
                                            </label>

                                            <input
                                                type="text"
                                                name="shipping_city"
                                                value={
                                                    formData.shipping_city
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label>
                                                Postal Code *
                                            </label>

                                            <input
                                                type="text"
                                                name="shipping_postal_code"
                                                value={
                                                    formData.shipping_postal_code
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                required
                                            />

                                        </div>


                                    </div>

                                </section>



                                {/* BILLING ADDRESS */}

                                <section className="checkout-card">

                                    <h2>
                                        Billing Address
                                    </h2>


                                    <label className="same-address">

                                        <input
                                            type="checkbox"
                                            checked={
                                                sameAsShipping
                                            }
                                            onChange={
                                                handleSameAsShipping
                                            }
                                        />

                                        <span>
                                            Same as shipping address
                                        </span>

                                    </label>


                                    <div className="checkout-field">

                                        <label>
                                            Billing Address
                                        </label>

                                        <textarea
                                            name="billing_address"
                                            value={
                                                formData.billing_address
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            rows="4"
                                            disabled={
                                                sameAsShipping
                                            }
                                        />

                                    </div>


                                    <div className="checkout-row">


                                        <div className="checkout-field">

                                            <label>
                                                City
                                            </label>

                                            <input
                                                type="text"
                                                name="billing_city"
                                                value={
                                                    formData.billing_city
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    sameAsShipping
                                                }
                                            />

                                        </div>


                                        <div className="checkout-field">

                                            <label>
                                                Postal Code
                                            </label>

                                            <input
                                                type="text"
                                                name="billing_postal_code"
                                                value={
                                                    formData.billing_postal_code
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    sameAsShipping
                                                }
                                            />

                                        </div>


                                    </div>

                                </section>


                            </div>



                            {/* =========================
                                RIGHT SIDE
                            ========================= */}

                            <div className="checkout-right">



                                {/* ORDER SUMMARY */}

                                <section className="checkout-card">

                                    <h2>
                                        Order Summary
                                    </h2>


                                    <div className="checkout-items">


                                        {
                                            cartItems.map(
                                                (item) => {

                                                    const product =
                                                        item.product_id;


                                                    return (

                                                        <div
                                                            className="checkout-item"
                                                            key={
                                                                item._id
                                                            }
                                                        >

                                                            <div className="checkout-item-info">

                                                                <strong>
                                                                    {
                                                                        product?.product_name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    Qty: {
                                                                        item.quantity
                                                                    }
                                                                </span>

                                                            </div>


                                                            <strong>

                                                                Rs.{" "}

                                                                {(
                                                                    Number(
                                                                        product?.price || 0
                                                                    ) *
                                                                    Number(
                                                                        item.quantity || 0
                                                                    )
                                                                ).toFixed(2)}

                                                            </strong>


                                                        </div>

                                                    );

                                                }
                                            )
                                        }


                                    </div>


                                    <div className="checkout-total-row">

                                        <span>
                                            Subtotal
                                        </span>

                                        <span>
                                            Rs.{" "}
                                            {total.toFixed(2)}
                                        </span>

                                    </div>


                                    <div className="checkout-total-row">

                                        <span>
                                            Delivery Fee
                                        </span>

                                        <span>
                                            Rs. 0.00
                                        </span>

                                    </div>


                                    <div className="checkout-grand-total">

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            Rs.{" "}
                                            {total.toFixed(2)}
                                        </strong>

                                    </div>


                                </section>



                                {/* PAYMENT */}

                                <section className="checkout-card">

                                    <h2>
                                        Payment Method
                                    </h2>


                                    <div className="payment-option">

                                        <input
                                            type="radio"
                                            checked
                                            readOnly
                                        />


                                        <div>

                                            <strong>
                                                Pay with PayHere
                                            </strong>

                                            <p>
                                                Credit / Debit Card
                                            </p>

                                        </div>


                                    </div>


                                    <div className="payhere-info">

                                        <strong>
                                            PayHere Sandbox
                                        </strong>

                                        <p>
                                            You will be redirected
                                            to PayHere's secure
                                            payment page.
                                        </p>

                                    </div>


                                    <button
                                        type="submit"
                                        className="checkout-pay-button"
                                    >

                                        Pay Now (
                                        Rs.{" "}
                                        {total.toFixed(2)}
                                        )

                                    </button>


                                </section>


                            </div>


                        </div>

                    </form>


                </div>

            </main>


            <Footer />


            {notification && (

                <Notification

                    type={
                        notification.type
                    }

                    message={
                        notification.message
                    }

                    onCancel={() =>
                        setNotification(null)
                    }

                />

            )}


        </>

    );

}
import {
    Link,
    useSearchParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/Payment/PaymentResult.css";


export default function OrderConfirmation() {

    const token =
        localStorage.getItem("token");


    const [searchParams] =
        useSearchParams();


    const orderId =
        searchParams.get("order_id");


    const [orderData, setOrderData] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    useEffect(() => {

    if (!orderId) {
        return;
    }


    let intervalId;


    const fetchOrder = async () => {

        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/orders/${orderId}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load order details"
                );

            }


            setOrderData(data);
            setLoading(false);


            // Stop checking once payment is confirmed
            if (
                data.payment?.payment_status === "success" ||
                data.payment?.payment_status === "failed" ||
                data.payment?.payment_status === "cancelled"
            ) {

                if (intervalId) {
                    clearInterval(intervalId);
                }

            }


        } catch (error) {
    setError(error.message);
    setLoading(false);

    // Stop retrying after an authentication or other request error.
    if (intervalId) {
        clearInterval(intervalId);
    }
}

    };


    // First request immediately
    fetchOrder();


    // Then check every 2 seconds
    intervalId =
        setInterval(
            fetchOrder,
            2000
        );


    return () => {

        clearInterval(intervalId);

    };

}, [orderId, token]);



    const displayedError = !orderId
        ? "Order ID not found"
        : error;
    const isLoading = Boolean(orderId) && loading;

    if (isLoading) {

        return (

            <>

                <BuyerNavbar />

                <main className="payment-result-page">

                    <div className="payment-result-card">

                        <p>
                            Loading order details...
                        </p>

                    </div>

                </main>

                <Footer />

            </>

        );

    }



    if (displayedError) {

        return (

            <>

                <BuyerNavbar />

                <main className="payment-result-page">

                    <div className="payment-result-card">

                        <div className="payment-result-icon cancelled">
                            !
                        </div>

                        <h1>
                            Unable to Load Order
                        </h1>

                        <p>
                            {displayedError}
                        </p>

                        <div className="payment-result-actions">

                            <Link
                                to="/buyer"
                                className="payment-result-primary"
                            >
                                Go to Home
                            </Link>

                        </div>

                    </div>

                </main>

                <Footer />

            </>

        );

    }



    const {
        order,
        items,
        payment
    } = orderData;


    return (

        <>

            <BuyerNavbar />


            <main className="payment-result-page">

                <div className="payment-result-card">


                    <div className="payment-result-icon success">
                        ✓
                    </div>


                    <h1>
                        Payment Successful
                    </h1>


                    <p>
                        Your order has been placed successfully.
                    </p>



                    {/* =========================
                        ORDER DETAILS
                    ========================= */}

                    <div className="payment-order-details">


                        <div className="payment-detail-row">

                            <span>
                                Order ID
                            </span>

                            <strong>
                                {order.order_code}
                            </strong>

                        </div>


                        <div className="payment-detail-row">

                            <span>
                                Order Date
                            </span>

                            <strong>

                                {
                                    order.created_at
                                        ? new Date(
                                            order.created_at
                                        ).toLocaleDateString()
                                        : "-"
                                }

                            </strong>

                        </div>


                        <div className="payment-detail-row">

                            <span>
                                Order Status
                            </span>

                            <strong className="payment-status-text">

                                {
                                    order.order_status
                                }

                            </strong>

                        </div>


                        <div className="payment-detail-row">

                            <span>
                                Payment Method
                            </span>

                            <strong>

                                {
                                    payment
                                        ?.payment_method ||
                                    "PayHere"
                                }

                            </strong>

                        </div>


                        <div className="payment-detail-row">

                            <span>
                                Payment Status
                            </span>

                            <strong className="payment-status-text">

                                {
                                    payment
                                        ?.payment_status ||
                                    "pending"
                                }

                            </strong>

                        </div>


                        <div className="payment-detail-row">

                            <span>
                                Total Amount
                            </span>

                            <strong>

                                Rs.{" "}

                                {
                                    Number(
                                        order.total_amount || 0
                                    ).toFixed(2)
                                }

                            </strong>

                        </div>


                    </div>



                    {/* =========================
                        ORDER ITEMS
                    ========================= */}

                    <div className="payment-items-section">

                        <h2>
                            Order Items
                        </h2>


                        {
                            items?.length > 0
                                ? items.map(
                                    (item) => (

                                        <div
                                            className="payment-item-row"
                                            key={item._id}
                                        >

                                            <div>

                                                <strong>
                                                    {
                                                        item
                                                            .product_id
                                                            ?.product_name ||
                                                        "Product"
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

                                                {
                                                    Number(
                                                        item.subtotal || 0
                                                    ).toFixed(2)
                                                }

                                            </strong>

                                        </div>

                                    )
                                )

                                : (
                                    <p>
                                        No order items found.
                                    </p>
                                )
                        }

                    </div>



                    {/* =========================
                        DELIVERY
                    ========================= */}

                    <div className="payment-delivery-section">

                        <h2>
                            Delivery Address
                        </h2>

                        <p>
                            {order.shipping_address}
                        </p>

                        <p>
                            {order.shipping_city},{" "}
                            {order.shipping_postal_code}
                        </p>

                    </div>



                    <p className="payment-thank-you">
                        Thank you for shopping with UniMart.
                    </p>



                    <div className="payment-result-actions">

                        <Link
                            to="/buyer"
                            className="payment-result-primary"
                        >
                            Go to Home
                        </Link>


                        <Link
                            to="/products"
                            className="payment-result-secondary"
                        >
                            Continue Shopping
                        </Link>

                    </div>


                </div>

            </main>


            <Footer />

        </>

    );

}
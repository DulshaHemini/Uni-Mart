import {
    useEffect,
    useState
} from "react";

import BuyerNavbar
    from "../../components/Buyer/BuyerNavbar.jsx";

import "../../styles/Buyer/MyOrders.css";


export default function MyOrders() {

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const token =
        localStorage.getItem("token");


    // =========================
    // LOAD ORDERS
    // =========================

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/orders/my-orders",
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
                        "Failed to load orders."
                    );

                }


                setOrders(
                    data.orders || []
                );


            } catch (error) {

                console.error(
                    "My Orders Error:",
                    error
                );

                setError(
                    error.message
                );

            } finally {

                setLoading(false);

            }

        };


        fetchOrders();

    }, [token]);


    // =========================
    // DATE FORMAT
    // =========================

    const formatDate = (date) => {

        return new Date(
            date
        ).toLocaleDateString();

    };


    // =========================
    // STATUS CLASS
    // =========================

    const getStatusClass = (status) => {

        return `order-status ${status}`;

    };


    return (

        <div className="my-orders-page">

            <BuyerNavbar />


            <main className="my-orders-container">

                <div className="my-orders-header">

                    <h1>
                        My Orders
                    </h1>

                    <p>
                        View your UniMart
                        order history and
                        payment status.
                    </p>

                </div>


                {/* LOADING */}

                {loading && (

                    <div className="orders-message">

                        Loading your orders...

                    </div>

                )}


                {/* ERROR */}

                {!loading && error && (

                    <div className="orders-error">

                        {error}

                    </div>

                )}


                {/* NO ORDERS */}

                {!loading &&
                    !error &&
                    orders.length === 0 && (

                    <div className="no-orders">

                        <h3>
                            No orders yet
                        </h3>

                        <p>
                            You have not placed
                            any orders yet.
                        </p>

                    </div>

                )}


                {/* ORDERS */}

                {!loading &&
                    !error &&
                    orders.length > 0 && (

                    <div className="orders-list">

                        {orders.map(
                            (order) => (

                            <div
                                key={order._id}
                                className="order-card"
                            >

                                {/* ORDER HEADER */}

                                <div className="order-card-header">

                                    <div>

                                        <span className="order-label">
                                            Order ID
                                        </span>

                                        <strong>
                                            {order.order_code}
                                        </strong>

                                    </div>


                                    <span
                                        className={
                                            getStatusClass(
                                                order.order_status
                                            )
                                        }
                                    >
                                        {order.order_status}
                                    </span>

                                </div>


                                {/* ORDER INFO */}

                                <div className="order-info-grid">

                                    <div>

                                        <span>
                                            Date
                                        </span>

                                        <strong>
                                            {formatDate(
                                                order.created_at
                                            )}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Total
                                        </span>

                                        <strong>
                                            Rs.{" "}
                                            {Number(
                                                order.total_amount
                                            ).toLocaleString()}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Payment
                                        </span>

                                        <strong>
                                            {order.payment
                                                ?.payment_method ||
                                                "N/A"}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Payment Status
                                        </span>

                                        <strong>
                                            {order.payment
                                                ?.payment_status ||
                                                "N/A"}
                                        </strong>

                                    </div>

                                </div>


                                {/* ORDER ITEMS */}

                                <div className="order-items">

                                    <h3>
                                        Items
                                    </h3>


                                    {order.items?.map(
                                        (item) => (

                                        <div
                                            key={item._id}
                                            className="order-item-row"
                                        >

                                            <div className="order-item-details">

                                                <strong>
                                                    {
                                                        item.product_id
                                                            ?.product_name
                                                        ||
                                                        "Product"
                                                    }
                                                </strong>

                                                <span>
                                                    Qty:{" "}
                                                    {item.quantity}
                                                </span>

                                            </div>


                                            <div className="order-item-price">

                                                Rs.{" "}
                                                {Number(
                                                    item.subtotal
                                                ).toLocaleString()}

                                            </div>

                                        </div>

                                    ))}

                                </div>


                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>

    );

}
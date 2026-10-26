import {
    useEffect,
    useState
} from "react";

import SellerLayout
    from "../../components/Seller/SellerLayout.jsx";

import "../../styles/Seller/SellerSales.css";


export default function SellerSales() {

    const token =
        localStorage.getItem("token");

    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const fetchSales =
            async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/orders/seller-orders",
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
                        "Failed to load sales."
                    );

                }


                setOrders(
                    data.orders || []
                );


            } catch (error) {

                console.error(
                    "Seller Sales Error:",
                    error
                );

                setError(
                    error.message
                );


            } finally {

                setLoading(false);

            }

        };


        fetchSales();

    }, [token]);


    // =========================
    // SUCCESSFUL SALES
    // =========================

    const successfulOrders =
        orders.filter(
            (order) =>
                order.order_status === "paid" ||
                order.order_status === "processing" ||
                order.order_status === "shipped" ||
                order.order_status === "completed"
        );


    const totalSales =
        successfulOrders.reduce(
            (total, order) =>
                total +
                Number(
                    order.seller_total || 0
                ),
            0
        );


    const completedOrders =
        orders.filter(
            (order) =>
                order.order_status === "completed"
        ).length;


    const pendingOrders =
        orders.filter(
            (order) =>
                order.order_status === "pending"
        ).length;


    const formatDate =
        (date) => {

        return new Date(
            date
        ).toLocaleDateString();

    };


    return (

        <SellerLayout>

            <div className="seller-sales-page">


                {/* HEADER */}

                <div className="seller-sales-header">

                    <h1>
                        Sales
                    </h1>

                    <p>
                        View your sales performance
                        and successful orders.
                    </p>

                </div>


                {loading ? (

                    <div className="seller-sales-message">
                        Loading sales...
                    </div>

                ) : error ? (

                    <div className="seller-sales-error">
                        {error}
                    </div>

                ) : (

                    <>


                        {/* =========================
                            SALES SUMMARY
                        ========================= */}

                        <section className="seller-sales-stats">


                            <div className="seller-sales-stat-card">

                                <div className="seller-sales-icon">
                                    💰
                                </div>

                                <div>

                                    <p>
                                        Total Sales
                                    </p>

                                    <h2>
                                        Rs.{" "}
                                        {totalSales.toLocaleString()}
                                    </h2>

                                </div>

                            </div>


                            <div className="seller-sales-stat-card">

                                <div className="seller-sales-icon">
                                    🛒
                                </div>

                                <div>

                                    <p>
                                        Successful Orders
                                    </p>

                                    <h2>
                                        {
                                            successfulOrders.length
                                        }
                                    </h2>

                                </div>

                            </div>


                            <div className="seller-sales-stat-card">

                                <div className="seller-sales-icon">
                                    ✅
                                </div>

                                <div>

                                    <p>
                                        Completed
                                    </p>

                                    <h2>
                                        {completedOrders}
                                    </h2>

                                </div>

                            </div>


                            <div className="seller-sales-stat-card">

                                <div className="seller-sales-icon">
                                    ⏳
                                </div>

                                <div>

                                    <p>
                                        Pending
                                    </p>

                                    <h2>
                                        {pendingOrders}
                                    </h2>

                                </div>

                            </div>


                        </section>


                        {/* =========================
                            SALES HISTORY
                        ========================= */}

                        <section className="seller-sales-history">

                            <div className="seller-sales-section-header">

                                <h2>
                                    Sales History
                                </h2>

                                <p>
                                    Orders included in your
                                    sales total.
                                </p>

                            </div>


                            {successfulOrders.length === 0 ? (

                                <div className="seller-sales-empty">

                                    <h3>
                                        No sales yet
                                    </h3>

                                    <p>
                                        Successful sales will
                                        appear here.
                                    </p>

                                </div>

                            ) : (

                                <div className="seller-sales-list">

                                    {successfulOrders.map(
                                        (order) => (

                                        <div
                                            key={order._id}
                                            className="seller-sale-row"
                                        >

                                            <div>

                                                <span>
                                                    Order
                                                </span>

                                                <strong>
                                                    {
                                                        order.order_code
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Date
                                                </span>

                                                <strong>

                                                    {
                                                        formatDate(
                                                            order.created_at
                                                        )
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Status
                                                </span>

                                                <strong
                                                    className={
                                                        `seller-sale-status ${order.order_status}`
                                                    }
                                                >
                                                    {
                                                        order.order_status
                                                    }
                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Amount
                                                </span>

                                                <strong className="seller-sale-amount">

                                                    Rs.{" "}

                                                    {Number(
                                                        order.seller_total
                                                    ).toLocaleString()}

                                                </strong>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>

                    </>

                )}

            </div>

        </SellerLayout>

    );
}
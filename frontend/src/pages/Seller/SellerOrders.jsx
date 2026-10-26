import {
    useEffect,
    useState
} from "react";

import SellerLayout
    from "../../components/Seller/SellerLayout.jsx";

import "../../styles/Seller/SellerOrders.css";


export default function SellerOrders() {

    const token =
        localStorage.getItem("token");


    const [orders, setOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");


    // =========================
    // LOAD SELLER ORDERS
    // =========================

    useEffect(() => {

        const fetchOrders =
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
                        "Failed to load seller orders"
                    );

                }


                setOrders(
                    data.orders || []
                );


            } catch (error) {

                console.error(
                    "Seller Orders Error:",
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
    // FORMAT DATE
    // =========================

    const formatDate =
        (date) => {

        return new Date(
            date
        ).toLocaleDateString();

    };


    // =========================
    // FILTER ORDERS
    // =========================

    const filteredOrders =
        statusFilter === "all"
            ? orders
            : orders.filter(
                (order) =>
                    order.order_status ===
                    statusFilter
            );


    return (

        <SellerLayout>

            <div className="seller-orders-page">

                <div className="seller-orders-container">


                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="seller-orders-header">

                        <h1>
                            Orders
                        </h1>

                        <p>
                            View orders that include
                            your products.
                        </p>


                        {/* STATUS FILTER */}

                        <div className="seller-orders-filter">

                            <label htmlFor="statusFilter">
                                Filter by Status
                            </label>


                            <select
                                id="statusFilter"
                                value={
                                    statusFilter
                                }
                                onChange={(event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="all">
                                    All Orders
                                </option>

                                <option value="pending">
                                    Pending
                                </option>

                                <option value="paid">
                                    Paid
                                </option>

                                <option value="processing">
                                    Processing
                                </option>

                                <option value="shipped">
                                    Shipped
                                </option>

                                <option value="completed">
                                    Completed
                                </option>

                                <option value="cancelled">
                                    Cancelled
                                </option>

                                <option value="failed">
                                    Failed
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loading && (

                        <div className="seller-orders-message">

                            Loading orders...

                        </div>

                    )}


                    {/* =========================
                        ERROR
                    ========================= */}

                    {!loading &&
                        error && (

                        <div className="seller-orders-error">

                            {error}

                        </div>

                    )}


                    {/* =========================
                        NO ORDERS
                    ========================= */}

                    {!loading &&
                        !error &&
                        filteredOrders.length === 0 && (

                        <div className="seller-orders-empty">

                            <h3>
                                No orders found
                            </h3>

                            <p>

                                {statusFilter === "all"
                                    ? "Orders containing your products will appear here."
                                    : `No ${statusFilter} orders found.`
                                }

                            </p>

                        </div>

                    )}


                    {/* =========================
                        ORDER LIST
                    ========================= */}

                    {!loading &&
                        !error &&
                        filteredOrders.length > 0 && (

                        <div className="seller-orders-list">

                            {filteredOrders.map(
                                (order) => (

                                <div
                                    key={order._id}
                                    className="seller-order-card"
                                >


                                    {/* ORDER TOP */}

                                    <div className="seller-order-top">

                                        <div>

                                            <span className="seller-order-label">
                                                Order ID
                                            </span>

                                            <strong>
                                                {order.order_code}
                                            </strong>

                                        </div>


                                        <span
                                            className={
                                                `seller-order-status ${order.order_status}`
                                            }
                                        >
                                            {order.order_status}
                                        </span>

                                    </div>


                                    {/* ORDER META */}

                                    <div className="seller-order-meta">

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
                                                Buyer
                                            </span>

                                            <strong>

                                                {
                                                    order.buyer
                                                        ? `${order.buyer.first_name} ${order.buyer.last_name}`
                                                        : "Unknown Buyer"
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Email
                                            </span>

                                            <strong>

                                                {
                                                    order.buyer?.email ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Your Total
                                            </span>

                                            <strong>

                                                Rs.{" "}

                                                {Number(
                                                    order.seller_total
                                                ).toLocaleString()}

                                            </strong>

                                        </div>

                                    </div>


                                    {/* =========================
                                        PRODUCTS
                                    ========================= */}

                                    <div className="seller-order-section">

                                        <h3>
                                            Products
                                        </h3>


                                        {order.items?.map(
                                            (item) => (

                                            <div
                                                key={item._id}
                                                className="seller-order-item"
                                            >

                                                <div>

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


                                                <strong>

                                                    Rs.{" "}

                                                    {Number(
                                                        item.subtotal
                                                    ).toLocaleString()}

                                                </strong>

                                            </div>

                                        ))}

                                    </div>


                                    {/* =========================
                                        SHIPPING
                                    ========================= */}

                                    <div className="seller-order-section">

                                        <h3>
                                            Shipping Details
                                        </h3>


                                        <div className="seller-shipping-grid">

                                            <div>

                                                <span>
                                                    Address
                                                </span>

                                                <strong>

                                                    {
                                                        order.shipping
                                                            ?.address
                                                        ||
                                                        "-"
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    City
                                                </span>

                                                <strong>

                                                    {
                                                        order.shipping
                                                            ?.city
                                                        ||
                                                        "-"
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Postal Code
                                                </span>

                                                <strong>

                                                    {
                                                        order.shipping
                                                            ?.postal_code
                                                        ||
                                                        "-"
                                                    }

                                                </strong>

                                            </div>


                                            <div>

                                                <span>
                                                    Phone
                                                </span>

                                                <strong>

                                                    {
                                                        order.shipping
                                                            ?.phone_number
                                                        ||
                                                        "-"
                                                    }

                                                </strong>

                                            </div>

                                        </div>

                                    </div>


                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </SellerLayout>

    );
}
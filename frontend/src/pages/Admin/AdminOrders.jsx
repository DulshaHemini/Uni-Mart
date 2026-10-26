import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Admin/AdminOrders.css";


export default function AdminOrders() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [statusFilter, setStatusFilter] = useState("");


    // ================================
    // LOAD ORDERS
    // ================================

    useEffect(() => {
        const loadOrders = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/admin/orders",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load orders."
                    );
                }

                setOrders(data.orders || []);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, [token]);


    // ================================
    // FILTER ORDERS
    // ================================

    const filteredOrders =
        statusFilter
            ? orders.filter(
                (order) =>
                    order.order_status ===
                    statusFilter
            )
            : orders;


    return (

        <div className="admin-orders-page">


            {/* HEADER */}

            <div className="admin-orders-header">

                <div>

                    <h1>
                        Order Management
                    </h1>

                    <p>
                        View and manage customer orders.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                >
                    Back to Dashboard
                </button>

            </div>


            {/* FILTER */}

            <div className="admin-orders-toolbar">

                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Status
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


            {/* LOADING */}

            {loading && (

                <div className="admin-orders-state">
                    Loading orders...
                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="admin-orders-error">
                    {error}
                </div>

            )}


            {/* TABLE */}

            {!loading && !error && (

                <div className="admin-orders-card">

                    <div className="admin-orders-table-wrapper">

                        <table className="admin-orders-table">

                            <thead>

                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer</th>
                                    <th>Email</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {filteredOrders.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="admin-orders-empty"
                                        >
                                            No orders found.
                                        </td>

                                    </tr>

                                ) : (

                                    filteredOrders.map(
                                        (order) => (

                                            <tr key={order._id}>

                                                <td className="admin-orders-code">
                                                    {order.order_code}
                                                </td>


                                                <td>

                                                    {
                                                        order.user_id
                                                            ? `${order.user_id.first_name} ${order.user_id.last_name}`
                                                            : "Unknown User"
                                                    }

                                                </td>


                                                <td>

                                                    {
                                                        order.user_id
                                                            ?.email ||
                                                        "-"
                                                    }

                                                </td>


                                                <td>
                                                    Rs.{" "}
                                                    {
                                                        Number(
                                                            order.total_amount
                                                        ).toLocaleString()
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={`admin-order-badge admin-order-${order.order_status}`}
                                                    >
                                                        {
                                                            order.order_status
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {
                                                        new Date(
                                                            order.created_at
                                                        ).toLocaleDateString()
                                                    }

                                                </td>


                                                <td>

                                                    <button
                                                        className="admin-order-view"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/orders/${order._id}`
                                                            )
                                                        }
                                                    >
                                                        View
                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    );

}
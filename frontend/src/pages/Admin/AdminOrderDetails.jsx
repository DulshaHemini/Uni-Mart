import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../styles/Admin/AdminOrderDetails.css";


export default function AdminOrderDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [orderData, setOrderData] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ================================
    // LOAD ORDER DETAILS
    // ================================

    const fetchOrderDetails = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:5000/api/admin/orders/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load order details."
                );

            }

            setOrderData(data);

            setSelectedStatus(
                data.order.order_status
            );

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchOrderDetails();

    }, [id]);


    // ================================
    // UPDATE STATUS
    // ================================

    const handleUpdateStatus = async () => {

        try {

            setSaving(true);
            setError("");
            setSuccess("");

            const response = await fetch(
                `http://localhost:5000/api/admin/orders/${id}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        order_status:
                            selectedStatus
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update order status."
                );

            }

            setSuccess(
                "Order status updated successfully."
            );

            await fetchOrderDetails();

        } catch (error) {

            setError(error.message);

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="admin-order-details-state">
                Loading order details...
            </div>
        );

    }


    if (error && !orderData) {

        return (
            <div className="admin-order-details-state admin-order-details-error">
                {error}
            </div>
        );

    }


    const {
        order,
        items,
        payment
    } = orderData;


    return (

        <div className="admin-order-details-page">


            {/* HEADER */}

            <div className="admin-order-details-header">

                <div>

                    <button
                        className="admin-order-back-link"
                        onClick={() =>
                            navigate(
                                "/admin/orders"
                            )
                        }
                    >
                        ← Back to Orders
                    </button>

                    <h1>
                        Order Details
                    </h1>

                    <p>
                        {order.order_code}
                    </p>

                </div>


                <span
                    className={`admin-order-detail-status admin-order-${order.order_status}`}
                >
                    {order.order_status}
                </span>

            </div>


            {error && (

                <div className="admin-order-details-message error">
                    {error}
                </div>

            )}


            {success && (

                <div className="admin-order-details-message success">
                    {success}
                </div>

            )}


            {/* TOP INFORMATION */}

            <div className="admin-order-info-grid">


                {/* CUSTOMER */}

                <div className="admin-order-info-card">

                    <h2>
                        Customer Information
                    </h2>

                    <p>
                        <strong>Name:</strong>{" "}
                        {
                            order.user_id
                                ? `${order.user_id.first_name} ${order.user_id.last_name}`
                                : "Unknown User"
                        }
                    </p>

                    <p>
                        <strong>Email:</strong>{" "}
                        {order.user_id?.email || "-"}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {order.phone_number || "-"}
                    </p>

                </div>


                {/* DELIVERY */}

                <div className="admin-order-info-card">

                    <h2>
                        Delivery Address
                    </h2>

                    <p>
                        {order.shipping_address}
                    </p>

                    <p>
                        {order.shipping_city}
                    </p>

                    <p>
                        {order.shipping_postal_code}
                    </p>

                </div>


                {/* PAYMENT */}

                <div className="admin-order-info-card">

                    <h2>
                        Payment Information
                    </h2>

                    <p>
                        <strong>Method:</strong>{" "}
                        {
                            payment?.payment_method ||
                            "PayHere"
                        }
                    </p>

                    <p>
                        <strong>Status:</strong>{" "}

                        <span
                            className={`admin-payment-status payment-${payment?.payment_status}`}
                        >
                            {
                                payment?.payment_status ||
                                "pending"
                            }
                        </span>

                    </p>

                    <p>
                        <strong>Amount:</strong>{" "}
                        Rs.{" "}
                        {
                            Number(
                                payment?.amount ||
                                order.total_amount
                            ).toLocaleString()
                        }
                    </p>

                </div>

            </div>


            {/* ITEMS */}

            <div className="admin-order-items-card">

                <h2>
                    Ordered Items
                </h2>


                <div className="admin-order-items-table-wrapper">

                    <table className="admin-order-items-table">

                        <thead>

                            <tr>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Subtotal</th>
                            </tr>

                        </thead>


                        <tbody>

                            {items.map(
                                (item) => (

                                    <tr key={item._id}>

                                        <td>

                                            <div className="admin-order-product-cell">

                                                {item.product_id?.image && (

                                                    <img
                                                        src={item.product_id.image}
                                                        alt={
                                                            item.product_id
                                                                ?.product_name
                                                        }
                                                    />

                                                )}


                                                <span>

                                                    {
                                                        item.product_id
                                                            ?.product_name ||
                                                        "Product unavailable"
                                                    }

                                                </span>

                                            </div>

                                        </td>


                                        <td>
                                            {item.quantity}
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {
                                                Number(
                                                    item.price
                                                ).toLocaleString()
                                            }
                                        </td>


                                        <td>
                                            Rs.{" "}
                                            {
                                                Number(
                                                    item.subtotal
                                                ).toLocaleString()
                                            }
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>


                <div className="admin-order-total">

                    <span>
                        Total
                    </span>

                    <strong>
                        Rs.{" "}
                        {
                            Number(
                                order.total_amount
                            ).toLocaleString()
                        }
                    </strong>

                </div>

            </div>


            {/* STATUS UPDATE */}

            <div className="admin-order-status-card">

                <div>

                    <h2>
                        Update Order Status
                    </h2>

                    <p>
                        Current status:
                        {" "}
                        <strong>
                            {order.order_status}
                        </strong>
                    </p>

                </div>


                <div className="admin-order-status-controls">

                    <select
                        value={selectedStatus}
                        onChange={(e) =>
                            setSelectedStatus(
                                e.target.value
                            )
                        }
                    >

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


                    <button
                        onClick={handleUpdateStatus}
                        disabled={
                            saving ||
                            selectedStatus ===
                            order.order_status
                        }
                    >
                        {
                            saving
                                ? "Updating..."
                                : "Update Status"
                        }
                    </button>

                </div>

            </div>

        </div>

    );

}
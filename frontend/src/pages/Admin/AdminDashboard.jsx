import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Admin/AdminDashboard.css";


export default function AdminDashboard() {

    const navigate = useNavigate();

    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    useEffect(() => {

        const fetchDashboard = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/admin/dashboard",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load dashboard"
                    );
                }

                setDashboardData(data);

            } catch (error) {

                console.error(error);

                setError(error.message);

            } finally {

                setLoading(false);

            }

        };

        fetchDashboard();

    }, [token]);


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    if (loading) {

        return (
            <div className="admin-page-state">
                Loading dashboard...
            </div>
        );

    }


    if (error) {

        return (
            <div className="admin-page-state admin-page-error">
                {error}
            </div>
        );

    }


    const {
        summary,
        recentOrders,
        lowStockProducts
    } = dashboardData;


    return (

        <div className="admin-dashboard-layout">


            {/* ================================
                SIDEBAR
            ================================ */}

            <aside className="admin-dashboard-sidebar">

                <div className="admin-brand">

                    <span className="admin-brand-uni">
                        Uni
                    </span>

                    <span className="admin-brand-mart">
                        Mart
                    </span>

                </div>


                <div className="admin-menu">

                    <button
                        className="admin-menu-item active"
                        onClick={() =>
                            navigate("/admin/dashboard")
                        }
                    >
                        <span className="admin-menu-icon">
                            ▦
                        </span>

                        Dashboard
                    </button>


                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >
                        <span className="admin-menu-icon">
                            □
                        </span>

                        Products
                    </button>


                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate("/admin/inventory")
                        }
                    >
                        <span className="admin-menu-icon">
                            ▤
                        </span>

                        Inventory
                    </button>


                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate("/admin/orders")
                        }
                    >
                        <span className="admin-menu-icon">
                            ≡
                        </span>

                        Orders
                    </button>


                    <button
                        className="admin-menu-item"
                        onClick={() =>
                            navigate("/admin/users")
                        }
                    >
                        <span className="admin-menu-icon">
                            ♙
                        </span>

                        Users
                    </button>

                </div>


                <div className="admin-sidebar-footer">

                    <div className="admin-sidebar-user">

                        <div className="admin-sidebar-avatar">

                            {user?.first_name
                                ?.charAt(0)
                                ?.toUpperCase() || "A"}

                        </div>


                        <div>

                            <strong>
                                {user?.first_name || "Admin"}
                            </strong>

                            <span>
                                Administrator
                            </span>

                        </div>

                    </div>


                    <button
                        className="admin-sidebar-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* ================================
                MAIN AREA
            ================================ */}

            <main className="admin-dashboard-main">


                {/* ================================
                    TOP HEADER
                ================================ */}

                <header className="admin-dashboard-header">

                    <div>

                        <h1>
                            Dashboard
                        </h1>

                        <p>
                            Welcome back,{" "}
                            {user?.first_name || "Admin"}.
                            Here’s what’s happening with UniMart.
                        </p>

                    </div>


                    <button
                        className="admin-primary-button"
                        onClick={() =>
                            navigate("/admin/products")
                        }
                    >
                        Manage Products
                    </button>

                </header>


                {/* ================================
                    SUMMARY CARDS
                ================================ */}

                <section className="admin-stat-grid">

                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <span>
                                Total Products
                            </span>

                            <div className="admin-stat-icon">
                                □
                            </div>

                        </div>

                        <h2>
                            {summary.totalProducts}
                        </h2>

                        <p>
                            Products currently in UniMart
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <span>
                                Total Orders
                            </span>

                            <div className="admin-stat-icon">
                                ≡
                            </div>

                        </div>

                        <h2>
                            {summary.totalOrders}
                        </h2>

                        <p>
                            Customer orders recorded
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <span>
                                Low Stock
                            </span>

                            <div className="admin-stat-icon warning">
                                !
                            </div>

                        </div>

                        <h2>
                            {summary.lowStock}
                        </h2>

                        <p>
                            Products with stock 5 or below
                        </p>

                    </div>


                    <div className="admin-stat-card">

                        <div className="admin-stat-top">

                            <span>
                                Total Users
                            </span>

                            <div className="admin-stat-icon">
                                ♙
                            </div>

                        </div>

                        <h2>
                            {summary.totalUsers}
                        </h2>

                        <p>
                            Registered UniMart users
                        </p>

                    </div>

                </section>


                {/* ================================
                    RECENT ORDERS
                ================================ */}

                <section className="admin-dashboard-section">

                    <div className="admin-section-header">

                        <div>

                            <h2>
                                Recent Orders
                            </h2>

                            <p>
                                Latest customer orders
                            </p>

                        </div>


                        <button
                            className="admin-text-button"
                            onClick={() =>
                                navigate("/admin/orders")
                            }
                        >
                            View All Orders
                        </button>

                    </div>


                    <div className="admin-dashboard-table-card">

                        <div className="admin-table-scroll">

                            <table className="admin-dashboard-table">

                                <thead>

                                    <tr>
                                        <th>Order ID</th>
                                        <th>Customer</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {recentOrders.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="admin-empty-cell"
                                            >
                                                No orders found.
                                            </td>

                                        </tr>

                                    ) : (

                                        recentOrders.map(
                                            (order) => (

                                                <tr key={order._id}>

                                                    <td className="admin-order-code">
                                                        {order.order_code}
                                                    </td>


                                                    <td>

                                                        <div className="admin-customer-cell">

                                                            <div className="admin-customer-avatar">

                                                                {
                                                                    order.user_id
                                                                        ?.first_name
                                                                        ?.charAt(0)
                                                                        ?.toUpperCase() || "U"
                                                                }

                                                            </div>


                                                            <div>

                                                                <strong>
                                                                    {
                                                                        order.user_id
                                                                            ? `${order.user_id.first_name} ${order.user_id.last_name}`
                                                                            : "Unknown User"
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        order.user_id
                                                                            ?.email || ""
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td>

                                                        {
                                                            new Date(
                                                                order.created_at
                                                            ).toLocaleDateString()
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
                                                            className={`admin-status-badge admin-status-${order.order_status}`}
                                                        >
                                                            {order.order_status}
                                                        </span>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </section>


                {/* ================================
                    LOWER GRID
                ================================ */}

                <section className="admin-lower-grid">


                    {/* LOW STOCK */}

                    <div className="admin-dashboard-section">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Low Stock Products
                                </h2>

                                <p>
                                    Products that need attention
                                </p>

                            </div>


                            <button
                                className="admin-text-button"
                                onClick={() =>
                                    navigate("/admin/inventory")
                                }
                            >
                                View Inventory
                            </button>

                        </div>


                        <div className="admin-low-stock-list">

                            {lowStockProducts.length === 0 ? (

                                <div className="admin-empty-box">
                                    No low stock products.
                                </div>

                            ) : (

                                lowStockProducts.map(
                                    (product) => (

                                        <div
                                            className="admin-low-stock-item"
                                            key={product._id}
                                        >

                                            <div>

                                                <strong>
                                                    {product.product_name}
                                                </strong>

                                                <span>
                                                    {
                                                        product.category_id
                                                            ?.category_name ||
                                                        "No Category"
                                                    }
                                                </span>

                                            </div>


                                            <div className="admin-stock-pill">
                                                {product.stock_quantity} left
                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>

                    </div>


                    {/* QUICK ACTIONS */}

                    <div className="admin-dashboard-section">

                        <div className="admin-section-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Manage UniMart quickly
                                </p>

                            </div>

                        </div>


                        <div className="admin-action-grid">

                            <button
                                onClick={() =>
                                    navigate("/admin/products")
                                }
                            >
                                <span className="admin-action-icon">
                                    +
                                </span>

                                <div>

                                    <strong>
                                        Manage Products
                                    </strong>

                                    <small>
                                        Add, edit or deactivate products
                                    </small>

                                </div>
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/orders")
                                }
                            >
                                <span className="admin-action-icon">
                                    ≡
                                </span>

                                <div>

                                    <strong>
                                        Manage Orders
                                    </strong>

                                    <small>
                                        View and update customer orders
                                    </small>

                                </div>
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/inventory")
                                }
                            >
                                <span className="admin-action-icon">
                                    ▤
                                </span>

                                <div>

                                    <strong>
                                        Inventory
                                    </strong>

                                    <small>
                                        Monitor product stock levels
                                    </small>

                                </div>
                            </button>


                            <button
                                onClick={() =>
                                    navigate("/admin/users")
                                }
                            >
                                <span className="admin-action-icon">
                                    ♙
                                </span>

                                <div>

                                    <strong>
                                        Manage Users
                                    </strong>

                                    <small>
                                        View registered users
                                    </small>

                                </div>
                            </button>

                        </div>

                    </div>

                </section>

            </main>

        </div>

    );

}
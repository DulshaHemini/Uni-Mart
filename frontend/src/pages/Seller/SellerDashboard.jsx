import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Notification from "../../components/Notification.jsx";
import Footer from "../../components/Footer";
import SellerNavbar from "../../components/Seller/SellerNavbar.jsx";

import "../../styles/Seller/SellerDashboard.css";

export default function SellerDashboard() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [
        productToDelete,
        setProductToDelete
    ] = useState(null);


    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const sellerId =
        user?.user_id ||
        user?._id ||
        user?.id;


    useEffect(() => {

        async function fetchSellerProducts() {

            if (!sellerId) {

                setError(
                    "Seller information not found."
                );

                setLoading(false);

                return;
            }


            try {

                const response = await fetch(
                    `http://localhost:5000/api/products/seller/${sellerId}`
                );

                const data = await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load products."
                    );

                }


                setProducts(
                    data.products || []
                );

            } catch (error) {

                console.log(error);

                setError(
                    "Failed to load seller products."
                );

            } finally {

                setLoading(false);

            }

        }


        fetchSellerProducts();

    }, [sellerId]);


    const handleDeleteProduct = async () => {

        if (!productToDelete) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/products/${productToDelete}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete product."
                );

            }


            setProducts((previousProducts) =>
                previousProducts.filter(
                    (product) =>
                        product._id !== productToDelete
                )
            );


            setProductToDelete(null);

        } catch (error) {

            console.log(error);

            setProductToDelete(null);

        }

    };


    return (
        <>

            <div className="seller-dashboard-page">

                <SellerNavbar />


                <div className="seller-dashboard-layout">

                    {/* Sidebar */}
                    <aside className="seller-sidebar">

                        <h3 className="seller-sidebar-title">
                            SELLER PANEL
                        </h3>


                        <nav className="seller-sidebar-menu">

                            <Link
                                to="/seller/dashboard"
                                className="seller-menu-link active"
                            >
                                <span>📊</span>
                                Dashboard
                            </Link>


                            <a
                                href="#seller-products"
                                className="seller-menu-link"
                            >
                                <span>📦</span>
                                Products
                            </a>


                            <button
                                type="button"
                                className="seller-menu-link seller-menu-button"
                            >
                                <span>🛒</span>
                                Orders
                            </button>


                            <button
                                type="button"
                                className="seller-menu-link seller-menu-button"
                            >
                                <span>💰</span>
                                Sales
                            </button>

                        </nav>

                    </aside>


                    {/* Main Content */}
                    <main className="seller-dashboard-main">

                        <div className="seller-dashboard-heading">

                            <div>

                                <h1>
                                    Seller Dashboard
                                </h1>

                                <p>
                                    Manage your products,
                                    orders and sales.
                                </p>

                            </div>


                            <Link
                                to="/seller/add-product"
                                className="seller-main-add-button"
                            >
                                + Add Product
                            </Link>

                        </div>


                        {/* Statistics */}
                        <section className="seller-stats">

                            {/* Products */}
                            <div className="seller-stat-card">

                                <div className="seller-stat-icon">
                                    📦
                                </div>

                                <div>

                                    <p>
                                        Products
                                    </p>

                                    <h2>
                                        {products.length}
                                    </h2>

                                </div>

                            </div>


                            {/* Orders */}
                            <div className="seller-stat-card">

                                <div className="seller-stat-icon">
                                    🛒
                                </div>

                                <div>

                                    <p>
                                        Orders
                                    </p>

                                    <h2>
                                        0
                                    </h2>

                                </div>

                            </div>


                            {/* Sales */}
                            <div className="seller-stat-card">

                                <div className="seller-stat-icon">
                                    💰
                                </div>

                                <div>

                                    <p>
                                        Total Sales
                                    </p>

                                    <h2>
                                        Rs. 0
                                    </h2>

                                </div>

                            </div>

                        </section>


                        {/* Products Section */}
                        <section
                            className="seller-products-section"
                            id="seller-products"
                        >

                            <div className="seller-section-header">

                                <div>

                                    <h2>
                                        My Products
                                    </h2>

                                    <p>
                                        Manage products you have
                                        listed on UniMart.
                                    </p>

                                </div>

                            </div>


                            {/* Loading */}
                            {loading ? (

                                <div className="seller-empty-products">

                                    <p>
                                        Loading products...
                                    </p>

                                </div>

                            ) : error ? (

                                /* Error */
                                <div className="seller-empty-products">

                                    <p>
                                        {error}
                                    </p>

                                </div>

                            ) : products.length === 0 ? (

                                /* No Products */
                                <div className="seller-empty-products">

                                    <div className="seller-empty-icon">
                                        📦
                                    </div>

                                    <h3>
                                        No products yet
                                    </h3>

                                    <p>
                                        Start selling by adding
                                        your first product.
                                    </p>

                                    <Link
                                        to="/seller/add-product"
                                        className="seller-empty-add-button"
                                    >
                                        Add Product
                                    </Link>

                                </div>

                            ) : (

                                /* Product List */
                                <div className="seller-products-list">

                                    {products.map((product) => (

                                        <div
                                            className="seller-product-row"
                                            key={product._id}
                                        >

                                            {/* Product Info */}
                                            <div className="seller-product-info">

                                                <h3>
                                                    {
                                                        product.product_name
                                                    }
                                                </h3>

                                                <p>

                                                    {
                                                        product.category_id
                                                            ?.category_name
                                                    }

                                                    {" • "}

                                                    {
                                                        product.condition
                                                    }

                                                    {" • "}

                                                    Stock:{" "}
                                                    {
                                                        product.stock_quantity
                                                    }

                                                </p>

                                            </div>


                                            {/* Price */}
                                            <div className="seller-product-price">

                                                Rs.{" "}

                                                {Number(
                                                    product.price
                                                ).toLocaleString()}

                                            </div>


                                            {/* Actions */}
                                            <div className="seller-product-actions">

                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="seller-product-action view"
                                                >
                                                    View
                                                </Link>


                                                <Link
                                                    to={`/seller/edit-product/${product._id}`}
                                                    className="seller-product-action edit"
                                                >
                                                    Edit
                                                </Link>


                                                <button
                                                    type="button"
                                                    className="seller-product-action delete"
                                                    onClick={() =>
                                                        setProductToDelete(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}

                        </section>

                    </main>

                </div>

            </div>


            {/* Delete Confirmation */}
            {productToDelete && (

                <Notification
                    type="confirm"
                    message="Are you sure you want to delete this product?"
                    onConfirm={handleDeleteProduct}
                    onCancel={() =>
                        setProductToDelete(null)
                    }
                />

            )}


            <Footer />

        </>
    );
}
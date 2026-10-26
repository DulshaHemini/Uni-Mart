import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import RecentlyPurchased from "../Product/RecentlyPurchased.jsx";

import "../../styles/Buyer/BuyerHome.css";

const API_URL = "http://localhost:5000/api";

export default function BuyerHome() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const token = localStorage.getItem("token");

    const [searchTerm, setSearchTerm] = useState("");

    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState("");

    const [cartCount, setCartCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const [activityLoading, setActivityLoading] = useState(true);
    const [busyProductId, setBusyProductId] = useState(null);
    const [feedback, setFeedback] = useState("");

    // Load real products for the recommendations section.
    useEffect(() => {
        let active = true;

        async function loadProducts() {
            try {
                setProductsLoading(true);
                setProductsError("");

                const response = await fetch(`${API_URL}/products`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load products."
                    );
                }

                if (active) {
                    setProducts((data.products || []).slice(0, 4));
                }
            } catch (error) {
                if (active) {
                    setProductsError(
                        error.message || "Unable to load products."
                    );
                }
            } finally {
                if (active) {
                    setProductsLoading(false);
                }
            }
        }

        loadProducts();

        return () => {
            active = false;
        };
    }, []);

    // Load activity counts from the existing authenticated APIs.
    useEffect(() => {
        let active = true;

        async function loadActivity() {
            if (!token || user?.role !== "buyer") {
                setCartCount(0);
                setOrderCount(0);
                setWishlistCount(0);
                setActivityLoading(false);
                return;
            }

            setActivityLoading(true);

            const headers = {
                Authorization: `Bearer ${token}`
            };

            const loadCart = async () => {
                const response = await fetch(`${API_URL}/cart`, {
                    headers
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load cart.");
                }

                return Number(data.item_count || 0);
            };

            const loadOrders = async () => {
                const response = await fetch(
                    `${API_URL}/orders/my-orders`,
                    { headers }
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load orders.");
                }

                return (data.orders || []).length;
            };

            const loadWishlist = async () => {
                const response = await fetch(`${API_URL}/wishlist`, {
                    headers
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load wishlist."
                    );
                }

                return (data.wishlist || []).length;
            };

            const results = await Promise.allSettled([
                loadCart(),
                loadOrders(),
                loadWishlist()
            ]);

            if (active) {
                if (results[0].status === "fulfilled") {
                    setCartCount(results[0].value);
                }

                if (results[1].status === "fulfilled") {
                    setOrderCount(results[1].value);
                }

                if (results[2].status === "fulfilled") {
                    setWishlistCount(results[2].value);
                }

                const failed = results.some(
                    (result) => result.status === "rejected"
                );

                if (failed) {
                    console.error(
                        "Some Buyer Home activity counts could not be loaded.",
                        results
                    );
                }

                setActivityLoading(false);
            }
        }

        loadActivity();

        // Refresh the cart count when another page changes the cart.
        const handleCartUpdated = () => {
            loadActivity();
        };

        window.addEventListener("cartUpdated", handleCartUpdated);

        return () => {
            active = false;
            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );
        };
    }, [token, user?.role]);

    // Search uses the existing Products page and query parameter.
    const handleSearch = (event) => {
        event.preventDefault();

        const search = searchTerm.trim();

        navigate(
            search
                ? `/products?search=${encodeURIComponent(search)}`
                : "/products"
        );
    };

    // Add a product using the existing cart API.
    const handleAddToCart = async (product) => {
        if (!token || !user) {
            navigate("/login");
            return;
        }

        if (user.role !== "buyer") {
            setFeedback("Only buyers can add products to the cart.");
            return;
        }

        try {
            setBusyProductId(product._id);
            setFeedback("");

            const response = await fetch(`${API_URL}/cart`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: product._id,
                    quantity: 1
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to add product to cart."
                );
            }

            setFeedback(`${product.product_name} added to your cart.`);
            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            setFeedback(error.message || "Unable to add product to cart.");
        } finally {
            setBusyProductId(null);
        }
    };

    // Save a product using the existing wishlist API.
    const handleAddToWishlist = async (product) => {
        if (!token || !user) {
            navigate("/login");
            return;
        }

        if (user.role !== "buyer") {
            setFeedback("Only buyers can save products to the wishlist.");
            return;
        }

        try {
            setBusyProductId(product._id);
            setFeedback("");

            const response = await fetch(`${API_URL}/wishlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    product_id: product._id
                })
            });

            const data = await response.json();

            if (response.status === 409) {
                setFeedback("This product is already in your wishlist.");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to save product."
                );
            }

            setWishlistCount((count) => count + 1);
            setFeedback(`${product.product_name} saved to your wishlist.`);
        } catch (error) {
            setFeedback(error.message || "Unable to save product.");
        } finally {
            setBusyProductId(null);
        }
    };

    return (
        <>
            <div className="buyer-page">
                <BuyerNavbar />

                <main className="buyer-main">
                    {/* WELCOME */}
                    <section className="buyer-welcome">
                        <p className="welcome-label">Welcome back</p>

                        <h1>
                            Hello, {user?.first_name || "Student"} 👋
                        </h1>

                        <p className="welcome-text">
                            Welcome back to your UniMart marketplace.
                        </p>

                        <form className="buyer-search" onSubmit={handleSearch}>
                            <span className="search-icon">🔍</span>

                            <input
                                type="search"
                                placeholder="Search for products..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(event.target.value)
                                }
                                aria-label="Search products"
                            />

                            <button type="submit">SEARCH</button>
                        </form>
                    </section>

                    {/* YOUR ACTIVITY */}
                    <section className="buyer-section" id="activity">
                        <div className="section-header">
                            <h2>Your Activity</h2>
                        </div>

                        <div className="activity-grid">
                            <Link to="/cart" className="activity-card">
                                <div className="activity-icon">🛒</div>
                                <div>
                                    <h3>My Cart</h3>
                                    <p>
                                        {activityLoading
                                            ? "Loading..."
                                            : `${cartCount} Items`}
                                    </p>
                                </div>
                                <span className="activity-arrow">→</span>
                            </Link>

                            <Link to="/orders" className="activity-card">
                                <div className="activity-icon">📦</div>
                                <div>
                                    <h3>My Orders</h3>
                                    <p>
                                        {activityLoading
                                            ? "Loading..."
                                            : `${orderCount} Orders`}
                                    </p>
                                </div>
                                <span className="activity-arrow">→</span>
                            </Link>

                            <Link to="/wishlist" className="activity-card">
                                <div className="activity-icon">♡</div>
                                <div>
                                    <h3>Wishlist</h3>
                                    <p>
                                        {activityLoading
                                            ? "Loading..."
                                            : `${wishlistCount} Saved`}
                                    </p>
                                </div>
                                <span className="activity-arrow">→</span>
                            </Link>
                        </div>
                    </section>

                    {/* CATEGORIES */}
                    <section
                        className="buyer-section"
                        id="categories"
                    >
                        <div className="section-header">
                            <h2>Browse Categories</h2>
                            <Link to="/products">View All →</Link>
                        </div>

                        <div className="category-grid">
                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>📚</span>
                                <strong>Books</strong>
                            </Link>

                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>💻</span>
                                <strong>Electronics</strong>
                            </Link>

                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>👕</span>
                                <strong>Clothing</strong>
                            </Link>

                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>✏️</span>
                                <strong>Stationery</strong>
                            </Link>
                        </div>
                    </section>

                    {/* RECOMMENDED PRODUCTS */}
                    <section className="buyer-section">
                        <div className="section-header">
                            <h2>Recommended For You</h2>
                            <Link to="/products">View All →</Link>
                        </div>

                        {feedback && (
                            <p role="status" aria-live="polite">
                                {feedback}
                            </p>
                        )}

                        {productsLoading && (
                            <p role="status">Loading products...</p>
                        )}

                        {!productsLoading && productsError && (
                            <p role="alert">{productsError}</p>
                        )}

                        {!productsLoading &&
                            !productsError &&
                            products.length === 0 && (
                                <p>No products are available right now.</p>
                            )}

                        {!productsLoading &&
                            !productsError &&
                            products.length > 0 && (
                                <div className="recommended-grid">
                                    {products.map((product) => (
                                        <div
                                            className="recommended-card"
                                            key={product._id}
                                        >
                                            <div className="recommended-image">
                                                <Link
                                                    to={`/products/${product._id}`}
                                                    aria-label={`View ${product.product_name}`}
                                                    style={{
                                                        display: "flex",
                                                        width: "100%",
                                                        height: "100%",
                                                        alignItems: "center",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    {product.image ? (
                                                        <img
                                                            src={product.image}
                                                            alt={product.product_name}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "contain"
                                                            }}
                                                        />
                                                    ) : (
                                                        <span>🛍️</span>
                                                    )}
                                                </Link>

                                                <button
                                                    type="button"
                                                    className="wishlist-button"
                                                    aria-label={`Save ${product.product_name} to wishlist`}
                                                    disabled={
                                                        busyProductId === product._id
                                                    }
                                                    onClick={() =>
                                                        handleAddToWishlist(product)
                                                    }
                                                >
                                                    ♡
                                                </button>
                                            </div>

                                            <div className="recommended-info">
                                                <h3>
                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        style={{
                                                            color: "inherit",
                                                            textDecoration: "none"
                                                        }}
                                                    >
                                                        {product.product_name}
                                                    </Link>
                                                </h3>

                                                <p>
                                                    Rs.{" "}
                                                    {Number(
                                                        product.price || 0
                                                    ).toLocaleString()}
                                                </p>

                                                {product.stock_quantity < 1 ? (
                                                    <button
                                                        type="button"
                                                        className="cart-button"
                                                        disabled
                                                    >
                                                        OUT OF STOCK
                                                    </button>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        className="cart-button"
                                                        disabled={
                                                            busyProductId === product._id
                                                        }
                                                        onClick={() =>
                                                            handleAddToCart(product)
                                                        }
                                                    >
                                                        {busyProductId === product._id
                                                            ? "PLEASE WAIT..."
                                                            : "ADD TO CART"}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </section>

                    {/* RECENTLY PURCHASED */}
                    <RecentlyPurchased />
                </main>
            </div>

            <Footer />
        </>
    );
}

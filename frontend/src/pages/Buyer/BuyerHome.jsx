
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import RecentlyPurchased from "../Product/RecentlyPurchased.jsx";

import "../../styles/Buyer/BuyerHome.css";

const API_URL = "http://localhost:5000/api";

export default function BuyerHome() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");
    const token = localStorage.getItem("token");

    const [searchTerm, setSearchTerm] = useState("");

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [categoriesLoading, setCategoriesLoading] = useState(true);
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState("");
    const [categoriesError, setCategoriesError] = useState("");

    const [cartCount, setCartCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);

    const [activityLoading, setActivityLoading] = useState(true);
    const [activityError, setActivityError] = useState("");

    const [busyProductId, setBusyProductId] = useState(null);
    const [feedback, setFeedback] = useState("");

    // Load active products for recommendations.
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

                const productList = Array.isArray(data)
                    ? data
                    : data.products;

                if (!Array.isArray(productList)) {
                    throw new Error(
                        "Unexpected products response from the server."
                    );
                }

                if (active) {
                    setProducts(productList.slice(0, 4));
                }
            } catch (error) {
                console.error("Failed to load products:", error);

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

    // Load categories.
    useEffect(() => {
        let active = true;

        async function loadCategories() {
            try {
                setCategoriesLoading(true);
                setCategoriesError("");

                const response = await fetch(`${API_URL}/categories`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load categories."
                    );
                }

                const categoryList = Array.isArray(data)
                    ? data
                    : data.categories;

                if (!Array.isArray(categoryList)) {
                    throw new Error(
                        "Unexpected categories response from the server."
                    );
                }

                if (active) {
                    setCategories(categoryList);
                }
            } catch (error) {
                console.error("Failed to load categories:", error);

                if (active) {
                    setCategories([]);
                    setCategoriesError(
                        error.message || "Failed to load categories."
                    );
                }
            } finally {
                if (active) {
                    setCategoriesLoading(false);
                }
            }
        }

        loadCategories();

        return () => {
            active = false;
        };
    }, []);

    // Load buyer activity counts.
    useEffect(() => {
        let active = true;

        async function loadActivity() {
            if (!token || user?.role !== "buyer") {
                setCartCount(0);
                setOrderCount(0);
                setWishlistCount(0);
                setActivityError("");
                setActivityLoading(false);
                return;
            }

            setActivityLoading(true);
            setActivityError("");

            const headers = {
                Authorization: `Bearer ${token}`
            };

            async function fetchJSON(url, options = {}) {
                const response = await fetch(url, options);

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        `Request failed (${response.status}).`
                    );
                }

                return data;
            }

            const loadCart = async () => {
                const data = await fetchJSON(`${API_URL}/cart`, {
                    headers
                });

                if (typeof data.item_count === "number") {
                    return data.item_count;
                }

                if (Array.isArray(data.items)) {
                    return data.items.reduce(
                        (total, item) =>
                            total + Number(item.quantity || 1),
                        0
                    );
                }

                if (Array.isArray(data.cart)) {
                    return data.cart.reduce(
                        (total, item) =>
                            total + Number(item.quantity || 1),
                        0
                    );
                }

                throw new Error(
                    "Cart API response does not contain item_count, items, or cart."
                );
            };

            const loadOrders = async () => {
                const data = await fetchJSON(
                    `${API_URL}/orders/my-orders`,
                    { headers }
                );

                const orders = Array.isArray(data)
                    ? data
                    : data.orders;

                if (!Array.isArray(orders)) {
                    throw new Error(
                        "Unexpected orders response from the server."
                    );
                }

                return orders.length;
            };

            const loadWishlist = async () => {
                const data = await fetchJSON(`${API_URL}/wishlist`, {
                    headers
                });

                const wishlist = Array.isArray(data)
                    ? data
                    : data.wishlist;

                if (!Array.isArray(wishlist)) {
                    throw new Error(
                        "Unexpected wishlist response from the server."
                    );
                }

                return wishlist.length;
            };

            const results = await Promise.allSettled([
                loadCart(),
                loadOrders(),
                loadWishlist()
            ]);

            if (!active) {
                return;
            }

            const errors = [];

            if (results[0].status === "fulfilled") {
                setCartCount(results[0].value);
            } else {
                errors.push(`Cart: ${results[0].reason.message}`);
                console.error("Cart count failed:", results[0].reason);
            }

            if (results[1].status === "fulfilled") {
                setOrderCount(results[1].value);
            } else {
                errors.push(`Orders: ${results[1].reason.message}`);
                console.error("Order count failed:", results[1].reason);
            }

            if (results[2].status === "fulfilled") {
                setWishlistCount(results[2].value);
            } else {
                errors.push(`Wishlist: ${results[2].reason.message}`);
                console.error("Wishlist count failed:", results[2].reason);
            }

            if (errors.length > 0) {
                setActivityError(errors.join(" "));
            }

            setActivityLoading(false);
        }

        loadActivity();

        const handleCartUpdated = () => {
            loadActivity();
        };

        const handleWishlistUpdated = () => {
            loadActivity();
        };

        const handleOrdersUpdated = () => {
            loadActivity();
        };

        window.addEventListener("cartUpdated", handleCartUpdated);
        window.addEventListener("wishlistUpdated", handleWishlistUpdated);
        window.addEventListener("ordersUpdated", handleOrdersUpdated);

        return () => {
            active = false;

            window.removeEventListener("cartUpdated", handleCartUpdated);
            window.removeEventListener(
                "wishlistUpdated",
                handleWishlistUpdated
            );
            window.removeEventListener("ordersUpdated", handleOrdersUpdated);
        };
    }, [token, user?.role]);

    // Search products.
    const handleSearch = (event) => {
        event.preventDefault();

        const search = searchTerm.trim();

        navigate(
            search
                ? `/products?search=${encodeURIComponent(search)}`
                : "/products"
        );
    };

    // Add a product to the cart.
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

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to add product to cart."
                );
            }

            setFeedback(`${product.product_name} added to your cart.`);

            window.dispatchEvent(new Event("cartUpdated"));
        } catch (error) {
            setFeedback(
                error.message || "Unable to add product to cart."
            );
        } finally {
            setBusyProductId(null);
        }
    };

    // Add a product to the wishlist.
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

            const data = await response.json().catch(() => ({}));

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

            setFeedback(
                `${product.product_name} saved to your wishlist.`
            );

            window.dispatchEvent(new Event("wishlistUpdated"));
        } catch (error) {
            setFeedback(
                error.message || "Unable to save product."
            );
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

                        <form
                            className="buyer-search"
                            onSubmit={handleSearch}
                        >
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

                        {activityError && (
                            <p role="alert" className="activity-error">
                                Some activity information could not be loaded.
                                Check the browser console for details.
                            </p>
                        )}

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

                        {categoriesLoading ? (
                            <p role="status">Loading categories...</p>
                        ) : categoriesError ? (
                            <p role="alert">{categoriesError}</p>
                        ) : categories.length === 0 ? (
                            <p>No categories available.</p>
                        ) : (
                            <div className="category-grid">
                                {categories.map((category) => (
                                    <Link
                                        key={category._id}
                                        to={`/products?category=${encodeURIComponent(
                                            category._id
                                        )}`}
                                        className="category-card"
                                    >
                                        <span>
                                            {category.icon || "🛍️"}
                                        </span>

                                        <strong>
                                            {category.category_name}
                                        </strong>
                                    </Link>
                                ))}
                            </div>
                        )}
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

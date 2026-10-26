import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Products/RecentlyPurchased.css";

const API_URL = "http://localhost:5000/api";

export default function RecentlyPurchased() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        async function loadRecentlyPurchased() {
            try {
                const response = await fetch(
                    `${API_URL}/products/recently-purchased`
                );

                const data = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load recent purchases."
                    );
                }

                if (active) {
                    setProducts(data.products || []);
                    setError("");
                }
            } catch (err) {
                if (active) {
                    setError(err.message || "Unable to load recent purchases.");
                }
            } finally {
                if (active) {
                    setLoading(false);
                }
            }
        }

        loadRecentlyPurchased();

        return () => {
            active = false;
        };
    }, []);

    function formatPurchaseTime(date) {
        if (!date) return "Purchased recently";

        const elapsed = Math.max(
            0,
            Date.now() - new Date(date).getTime()
        );

        const minutes = Math.floor(elapsed / 60000);

        if (minutes < 1) return "Just purchased";
        if (minutes < 60) return `${minutes} minute(s) ago`;

        const hours = Math.floor(minutes / 60);

        if (hours < 24) return `${hours} hour(s) ago`;

        return new Date(date).toLocaleDateString();
    }

    return (
        <section className="recently-purchased">
            <div className="recently-purchased-container">
                <div className="recently-purchased-header">
                    <h2>Recently Purchased by Students</h2>
                    <p>See products recently purchased by UniMart buyers</p>
                </div>

                {loading ? (
                    <p role="status">Loading recent purchases...</p>
                ) : error ? (
                    <p role="alert">{error}</p>
                ) : products.length === 0 ? (
                    <p>
                        No completed purchases are available to display yet.
                    </p>
                ) : (
                    <div className="recently-purchased-grid">
                        {products.map((product) => (
                            <Link
                                to={`/products/${product._id}`}
                                className="recently-purchased-card"
                                key={product._id}
                                style={{
                                    color: "inherit",
                                    textDecoration: "none"
                                }}
                            >
                                <div className="recently-purchased-image">
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
                                        <span aria-label="Product">
                                            🛍️
                                        </span>
                                    )}
                                </div>

                                <div className="recently-purchased-info">
                                    <h3>{product.product_name}</h3>

                                    <p className="recently-purchased-price">
                                        Rs. {Number(product.price).toLocaleString()}
                                    </p>

                                    <span className="purchased-time">
                                        {formatPurchaseTime(
                                            product.lastPurchasedAt
                                        )}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
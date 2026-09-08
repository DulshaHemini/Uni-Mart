import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../../components/Product/ProductCard";
import "../../styles/Products/FeaturedProducts.css";

export default function FeaturedProducts() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        async function fetchFeaturedProducts() {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/products"
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Failed to load products."
                    );
                }

                setProducts(
                    (data.products || []).slice(0, 4)
                );

            } catch (error) {

                console.log(error);

                setError(
                    "Failed to load featured products."
                );

            } finally {

                setLoading(false);

            }

        }

        fetchFeaturedProducts();

    }, []);


    return (
        <section className="featured-section">

            <div className="featured-container">

                <div className="featured-header">

                    <div className="featured-title">

                        <h2>
                            Featured Products
                        </h2>

                        <p>
                            Discover popular products from students.
                        </p>

                    </div>

                    <Link
                        to="/products"
                        className="view-all-products"
                    >
                        View All Products →
                    </Link>

                </div>


                {loading ? (

                    <p>
                        Loading featured products...
                    </p>

                ) : error ? (

                    <p>
                        {error}
                    </p>

                ) : products.length === 0 ? (

                    <p>
                        No products available yet.
                    </p>

                ) : (

                    <div className="featured-grid">

                        {products.map((product) => (

                            <ProductCard
                                key={product._id}
                                product={product}
                            />

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
}
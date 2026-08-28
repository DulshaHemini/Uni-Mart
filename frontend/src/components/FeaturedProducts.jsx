import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";
import "../styles/FeaturedProducts.css";

export default function FeaturedProducts() {

    const products = [
        {
            id: 1,
            name: "University Textbook",
            price: 500
        },
        {
            id: 2,
            name: "Scientific Calculator",
            price: 1200
        },
        {
            id: 3,
            name: "Student Backpack",
            price: 800
        },
        {
            id: 4,
            name: "Notebook Set",
            price: 250
        }
    ];

    return (
        <section className="featured-section">

            <div className="featured-container">

                <div className="featured-header">

                    <div className="featured-title">

                        <h2>Featured Products</h2>

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

                <div className="featured-grid">

                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                        />
                    ))}

                </div>

            </div>

        </section>
    );
}
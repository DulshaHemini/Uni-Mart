import { Link } from "react-router-dom";
import "../../styles/Products/ProductCard.css";

export default function ProductCard({ product }) {

    return (
        <div className="product-card">

            <div className="product-image">

                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.product_name}
                    />
                ) : (
                    <span>PRODUCT IMAGE</span>
                )}

            </div>

            <div className="product-info">

                <h3>
                    {product.product_name}
                </h3>

                <div className="product-rating">
                    ⭐⭐⭐⭐⭐
                </div>

                <p className="product-price">
                    Rs.{" "}
                    {Number(
                        product.price
                    ).toLocaleString()}
                </p>

                <div className="product-actions">

                    <Link
                        to={`/products/${product._id}`}
                        className="view-product-button"
                    >
                        View
                    </Link>

                    <button
                        className="wishlist-button"
                        type="button"
                    >
                        ♡
                    </button>

                </div>

            </div>

        </div>
    );
}
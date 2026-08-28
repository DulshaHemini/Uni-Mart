import { Link } from "react-router-dom";
import "../styles/ProductCard.css";

export default function ProductCard({ product }) {
return (
<div className="product-card">

        <div className="product-image">
            <span>PRODUCT IMAGE</span>
        </div>

        <div className="product-info">

            <h3>{product.name}</h3>

            <div className="product-rating">
                ⭐⭐⭐⭐⭐
            </div>

            <p className="product-price">
                Rs. {product.price.toLocaleString()}
            </p>

            <div className="product-actions">

                <Link
                    to={`/product/${product.id}`}
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
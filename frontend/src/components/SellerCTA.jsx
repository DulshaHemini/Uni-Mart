import { Link } from "react-router-dom";
import "../styles/SellerCTA.css";

export default function SellerCTA() {
return (
<section className="seller-cta">

        <div className="seller-cta-content">

            <div className="seller-cta-text">

                <p className="seller-cta-label">
                    HAVE SOMETHING TO SELL?
                </p>

                <h2>
                    Start Selling on UniMart
                </h2>

                <p>
                    Turn your unused items into extra money
                    by selling them to fellow university students.
                </p>

            </div>

            <Link
                to="/seller/add-product"
                className="seller-cta-button"
            >
                Start Selling →
            </Link>

        </div>

    </section>
);

}
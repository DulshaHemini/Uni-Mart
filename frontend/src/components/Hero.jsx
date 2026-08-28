import { Link } from "react-router-dom";
import "../styles/Hero.css";

export default function Hero() {
    return (
        <section className="hero">

            <div className="hero-content">

                <p className="hero-label">
                    SRI LANKA UNIVERSITY MARKETPLACE
                </p>

                <h1>
                    BUY • SELL • CONNECT
                </h1>

                <h2>
                    The Student Marketplace
                </h2>

                <p className="hero-description">
                    Find affordable products from students around
                    your university.
                </p>

                <div className="hero-buttons">

                <Link
                    to="/products"
                    className="hero-button"
                >
                    Browse Products →
                </Link>

                <Link
                    to="/seller/add-product"
                    className="hero-button hero-sell-button"
                >
                    Sell Products →
                </Link>

            </div>

            </div>

        </section>
    );
}
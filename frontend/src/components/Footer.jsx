import { Link } from "react-router-dom";
import "../styles/Footer.css";

export default function Footer() {
return (
<footer className="footer">

        <div className="footer-container">

            <div className="footer-brand">

                <Link to="/" className="footer-logo">
                    <span className="logo-uni">Uni</span>
                    <span className="logo-mart">Mart</span>
                </Link>

                <p>
                    A student marketplace to buy, sell,
                    and connect with fellow students.
                </p>

            </div>

            <div className="footer-links">

                <div>
                    <h3>UniMart</h3>

                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <a href="/#categories">Categories</a>
                </div>

                <div>
                    <h3>Help</h3>

                    <Link to="/contact">Contact</Link>
                    <Link to="/help-center">Help Center</Link>
                    <Link to="/privacy">Privacy</Link>
                </div>

            </div>

        </div>

        <div className="footer-bottom">

            <p>
                © 2026 UniMart. All rights reserved.
            </p>

        </div>

    </footer>
);

}
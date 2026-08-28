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

                    <a href="#contact">Contact</a>
                    <a href="#help">Help Center</a>
                    <a href="#privacy">Privacy</a>
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
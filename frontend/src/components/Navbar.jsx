import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar">

            {/* Logo */}

            <Link to="/" className="navbar-logo">
                <span className="logo-uni">Uni</span>
                <span className="logo-mart">Mart</span>
            </Link>


            {/* Desktop Navigation */}

            <div className="desktop-nav">

                <Link to="/">Home</Link>

                <Link to="/products">Products</Link>

                <a href="/#categories">Categories</a>

            </div>


            {/* Desktop Actions */}

            <div className="desktop-actions">

                {/* Search */}

                <div className="navbar-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search products..."
                    />

                </div>


                {/* Login */}

                <Link
                    to="/login"
                    className="nav-auth-button"
                >
                    Login
                </Link>


                {/* Register */}

                <Link
                    to="/register"
                    className="nav-auth-button"
                >
                    Register
                </Link>

            </div>


            {/* Mobile Menu Button */}

            <button
                className="mobile-menu-button"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle navigation menu"
            >
                {menuOpen ? "✕" : "☰"}
            </button>


            {/* Mobile Menu */}

            {menuOpen && (

                <div className="mobile-menu">

                    <Link
                        to="/"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>

                    <Link
                        to="/products"
                        onClick={() => setMenuOpen(false)}
                    >
                        Products
                    </Link>

                    <a
                        href="/#categories"
                        onClick={() => setMenuOpen(false)}
                    >
                        Categories
                    </a>


                    {/* Mobile Search */}

                    <div className="mobile-search">

                        <span>🔍</span>

                        <input
                            type="text"
                            placeholder="Search products..."
                        />

                    </div>


                    {/* Mobile Login */}

                    <Link
                        to="/login"
                        className="mobile-auth-button"
                        onClick={() => setMenuOpen(false)}
                    >
                        Login
                    </Link>


                    {/* Mobile Register */}

                    <Link
                        to="/register"
                        className="mobile-auth-button"
                        onClick={() => setMenuOpen(false)}
                    >
                        Register
                    </Link>

                </div>

            )}

        </nav>
    );
}
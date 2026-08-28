import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    // Temporary login state
    // Later this will come from real JWT authentication
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const handleLogout = () => {
        setIsLoggedIn(false);
        setProfileOpen(false);
    };

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

                <div className="navbar-search">

                    <span>🔍</span>

                    <input
                        type="text"
                        placeholder="Search products..."
                    />

                </div>


                <Link to="/cart">
                    🛒 Cart
                </Link>


                {/* Login OR Profile */}

                {!isLoggedIn ? (

                    <Link to="/login">
                        👤 Login
                    </Link>

                ) : (

                    <div className="profile-wrapper">

                        <button
                            className="profile-button"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            👤 Profile ▾
                        </button>


                        {profileOpen && (

                            <div className="profile-dropdown">

                                <Link
                                    to="/profile"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    👤 My Profile
                                </Link>

                                <Link
                                    to="/orders"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    📦 My Orders
                                </Link>

                                <Link
                                    to="/settings"
                                    onClick={() => setProfileOpen(false)}
                                >
                                    ⚙ Account
                                </Link>

                                <button
                                    onClick={handleLogout}
                                >
                                    🚪 Logout
                                </button>

                            </div>

                        )}

                    </div>

                )}

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


                    <Link
                        to="/cart"
                        onClick={() => setMenuOpen(false)}
                    >
                        🛒 Cart
                    </Link>


                                
                {/* Mobile Login OR Profile */}

                {!isLoggedIn ? (

                    <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                    >
                        👤 Login
                    </Link>

                ) : (

                    <>

                        <Link
                            to="/profile"
                            onClick={() => setMenuOpen(false)}
                        >
                            👤 Profile
                        </Link>

                        <Link
                            to="/orders"
                            onClick={() => setMenuOpen(false)}
                        >
                            📦 My Orders
                        </Link>

                        <Link
                            to="/settings"
                            onClick={() => setMenuOpen(false)}
                        >
                            ⚙ Account
                        </Link>

                        <button
                            className="mobile-logout"
                            onClick={() => {
                                handleLogout();
                                setMenuOpen(false);
                            }}
                        >
                            🚪 Logout
                        </button>

                    </>

                )}



                </div>

            )}

        </nav>
    );
}
import { useState } from "react";
import {
    Link,
    useNavigate
} from "react-router-dom";

import "../styles/Navbar.css";

export default function Navbar() {

    const [menuOpen, setMenuOpen] =
        useState(false);

    const [searchTerm, setSearchTerm] =
        useState("");

    const navigate = useNavigate();


    // =========================
    // SEARCH PRODUCTS
    // =========================

    const handleSearch = (e) => {

        e.preventDefault();

        const search =
            searchTerm.trim();

        if (!search) {
            return;
        }

        navigate(
            `/products?search=${encodeURIComponent(search)}`
        );

        setMenuOpen(false);

    };


    return (
        <nav className="navbar">

            {/* LOGO */}

            <Link
                to="/"
                className="navbar-logo"
            >
                <span className="logo-uni">
                    Uni
                </span>

                <span className="logo-mart">
                    Mart
                </span>
            </Link>


            {/* DESKTOP NAVIGATION */}

            <div className="desktop-nav">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <a href="/#categories">
                    Categories
                </a>

            </div>


            {/* DESKTOP ACTIONS */}

            <div className="desktop-actions">

                {/* SEARCH */}

                <form
                    className="navbar-search"
                    onSubmit={handleSearch}
                >

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                    />

                </form>


                {/* LOGIN */}

                <Link
                    to="/login"
                    className="nav-auth-button"
                >
                    Login
                </Link>


                {/* REGISTER */}

                <Link
                    to="/register"
                    className="nav-auth-button"
                >
                    Register
                </Link>

            </div>


            {/* MOBILE MENU BUTTON */}

            <button
                className="mobile-menu-button"
                onClick={() =>
                    setMenuOpen(
                        !menuOpen
                    )
                }
                aria-label="Toggle navigation menu"
            >
                {menuOpen ? "✕" : "☰"}
            </button>


            {/* MOBILE MENU */}

            {menuOpen && (

                <div className="mobile-menu">

                    <Link
                        to="/"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        Home
                    </Link>

                    <Link
                        to="/products"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        Products
                    </Link>

                    <a
                        href="/#categories"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        Categories
                    </a>


                    {/* MOBILE SEARCH */}

                    <form
                        className="mobile-search"
                        onSubmit={handleSearch}
                    >

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) =>
                                setSearchTerm(
                                    e.target.value
                                )
                            }
                        />

                    </form>


                    {/* MOBILE LOGIN */}

                    <Link
                        to="/login"
                        className="mobile-auth-button"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        Login
                    </Link>


                    {/* MOBILE REGISTER */}

                    <Link
                        to="/register"
                        className="mobile-auth-button"
                        onClick={() =>
                            setMenuOpen(false)
                        }
                    >
                        Register
                    </Link>

                </div>

            )}

        </nav>
    );
}
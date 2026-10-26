
import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

export default function BuyerNavbar() {

    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [user, setUser] = useState(null);

    const profileRef = useRef(null);

    // =========================
    // CURRENT USER
    // =========================

    useEffect(() => {

        const loadUser = () => {

            try {
                const storedUser = localStorage.getItem("user");

                if (!storedUser || !storedUser.trim()) {
                    setUser(null);
                    return;
                }

                const parsedUser = JSON.parse(storedUser);

                setUser(
                    parsedUser &&
                    typeof parsedUser === "object" &&
                    !Array.isArray(parsedUser)
                        ? parsedUser
                        : null
                );

            } catch (error) {

                console.error(
                    "Unable to read stored user:",
                    error
                );

                setUser(null);
            }
        };

        loadUser();

        window.addEventListener("storage", loadUser);

        return () => {
            window.removeEventListener("storage", loadUser);
        };

    }, []);

    const token = localStorage.getItem("token");

    // =========================
    // CLOSE PROFILE DROPDOWN
    // =========================

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }

        };

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );

        };

    }, []);

    // =========================
    // GET CART COUNT
    // =========================

    useEffect(() => {

        if (!token) {
            setCartCount(0);
            return;
        }

        const fetchCartCount = async () => {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/cart",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load cart."
                    );
                }

                setCartCount(data.item_count || 0);

            } catch (error) {

                console.error(
                    "Cart count error:",
                    error
                );

            }

        };

        fetchCartCount();

        const handleCartUpdated = () => {
            fetchCartCount();
        };

        window.addEventListener(
            "cartUpdated",
            handleCartUpdated
        );

        return () => {

            window.removeEventListener(
                "cartUpdated",
                handleCartUpdated
            );

        };

    }, [token]);

    // =========================
    // LOGOUT
    // =========================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
        setCartCount(0);
        setProfileOpen(false);

        navigate("/");
    };

    // =========================
    // NAVBAR
    // =========================

    return (

        <header className="buyer-header">

            {/* LOGO */}

            <Link
                to="/buyer"
                className="buyer-logo"
            >
                <span className="logo-uni">
                    Uni
                </span>

                <span className="logo-mart">
                    Mart
                </span>
            </Link>

            {/* NAVIGATION */}

            <nav className="buyer-nav">

                <Link to="/buyer">
                    Home
                </Link>

                <Link to="/products">
                    Shop
                </Link>

                <Link to="/buyer#categories">
                    Categories
                </Link>

                <Link to="/buyer#activity">
                    Activity
                </Link>

            </nav>

            {/* HEADER ACTIONS */}

            <div className="buyer-actions">

                {/* WISHLIST */}

                <Link
                    to="/wishlist"
                    className="header-icon"
                    title="Wishlist"
                >
                    ♡
                </Link>

                {/* CART */}

                <Link
                    to="/cart"
                    className="header-icon cart-icon-wrapper"
                    title="Cart"
                >
                    <span>🛒</span>

                    {cartCount > 0 && (
                        <span className="cart-badge">
                            {cartCount}
                        </span>
                    )}
                </Link>

                {/* PROFILE */}

                <div
                    className="profile-wrapper"
                    ref={profileRef}
                >

                    <button
                        className="profile-button"
                        type="button"
                        onClick={() =>
                            setProfileOpen(!profileOpen)
                        }
                    >
                        👤

                        <span>
                            {user?.first_name || "Profile"}
                        </span>

                        <span className="profile-arrow">
                            {profileOpen ? "▴" : "▾"}
                        </span>
                    </button>

                    {/* PROFILE DROPDOWN */}

                    {profileOpen && (

                        <div className="profile-dropdown">

                            {/* USER INFORMATION */}

                            <div className="profile-info">

                                <div className="profile-avatar">
                                    👤
                                </div>

                                <div className="profile-user-details">

                                    <strong>
                                        {user?.first_name
                                            ? `${user.first_name} ${user.last_name || ""}`.trim()
                                            : "Student"
                                        }
                                    </strong>

                                    <span>
                                        {user?.email || "No email"}
                                    </span>

                                </div>

                            </div>

                            <div className="dropdown-divider"></div>

                            {/* PROFILE LINKS */}

                            <Link
                                to="/profile"
                                className="dropdown-item"
                                onClick={() => setProfileOpen(false)}
                            >
                                <span>👤</span>
                                <span>My Profile</span>
                            </Link>

                            <Link
                                to="/orders"
                                className="dropdown-item"
                                onClick={() => setProfileOpen(false)}
                            >
                                <span>📦</span>
                                <span>My Orders</span>
                            </Link>

                            <Link
                                to="/wishlist"
                                className="dropdown-item"
                                onClick={() => setProfileOpen(false)}
                            >
                                <span>❤️</span>
                                <span>Wishlist</span>
                            </Link>

                            <Link
                                to="/settings"
                                className="dropdown-item"
                                onClick={() => setProfileOpen(false)}
                            >
                                <span>⚙️</span>
                                <span>Account Settings</span>
                            </Link>

                            <div className="dropdown-divider"></div>

                            {/* LOGOUT */}

                            <button
                                type="button"
                                className="dropdown-item logout-item"
                                onClick={handleLogout}
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>

                        </div>
                    )}

                </div>

            </div>

        </header>
    );
}
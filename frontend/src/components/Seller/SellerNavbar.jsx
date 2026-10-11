import {
    useEffect,
    useRef,
    useState
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import "../../styles/Seller/SellerNavbar.css";


export default function SellerNavbar() {

    const [profileOpen, setProfileOpen] = useState(false);

    const profileRef = useRef(null);

    const navigate = useNavigate();


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const sellerName =
        user?.first_name ||
        user?.name ||
        "Seller";


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


    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    };


    return (
        <nav className="seller-navbar">

            <div className="seller-navbar-container">

                <Link
                    to="/seller/dashboard"
                    className="seller-navbar-logo"
                >
                    <span className="seller-logo-uni">
                        Uni
                    </span>

                    <span className="seller-logo-mart">
                        Mart
                    </span>
                </Link>


                <div className="seller-navbar-right">

                    <div
                        className="seller-profile-wrapper"
                        ref={profileRef}
                    >

                        <button
                            type="button"
                            className="seller-profile-button"
                            onClick={() =>
                                setProfileOpen(!profileOpen)
                            }
                        >

                            <span className="seller-profile-icon">
                                👤
                            </span>

                            <span>
                                {sellerName}
                            </span>

                            <span
                                className={
                                    profileOpen
                                        ? "seller-arrow open"
                                        : "seller-arrow"
                                }
                            >
                                ▼
                            </span>

                        </button>


                        {profileOpen && (

                            <div className="seller-profile-dropdown">

                                <Link
                                    to="/seller/profile"
                                    className="seller-dropdown-item"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                >
                                    <span>👤</span>
                                    My Profile
                                </Link>


                                <Link
                                    to="/seller/settings"
                                    className="seller-dropdown-item"
                                    onClick={() =>
                                        setProfileOpen(false)
                                    }
                                >
                                    <span>⚙️</span>
                                    Settings
                                </Link>


                                <div className="seller-dropdown-divider" />


                                <button
                                    type="button"
                                    className="seller-dropdown-item seller-logout-item"
                                    onClick={handleLogout}
                                >
                                    <span>🚪</span>
                                    Logout
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </nav>
    );
}
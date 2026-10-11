import { Link } from "react-router-dom";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import RecentlyPurchased from "../Product/RecentlyPurchased.jsx";

import "../../styles/Buyer/BuyerHome.css";


export default function BuyerHome() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    return (
        <>

            <div className="buyer-page">

                {/* =========================
                    BUYER NAVBAR
                ========================= */}

                <BuyerNavbar />


                {/* =========================
                    MAIN
                ========================= */}

                <main className="buyer-main">


                    {/* =========================
                        WELCOME
                    ========================= */}

                    <section className="buyer-welcome">

                        <p className="welcome-label">
                            Welcome back
                        </p>

                        <h1>
                            Hello,{" "}
                            {user?.first_name || "Student"} 👋
                        </h1>

                        <p className="welcome-text">
                            Welcome back to your UniMart marketplace.
                        </p>


                        <div className="buyer-search">

                            <span className="search-icon">
                                🔍
                            </span>

                            <input
                                type="text"
                                placeholder="Search for products..."
                            />

                            <button type="button">
                                SEARCH
                            </button>

                        </div>

                    </section>


                    {/* =========================
                        YOUR ACTIVITY
                    ========================= */}

                    <section
                        className="buyer-section"
                        id="activity"
                    >

                        <div className="section-header">
                            <h2>Your Activity</h2>
                        </div>


                        <div className="activity-grid">

                            <div className="activity-card">

                                <div className="activity-icon">
                                    🛒
                                </div>

                                <div>
                                    <h3>My Cart</h3>
                                    <p>0 Items</p>
                                </div>

                                <span className="activity-arrow">
                                    →
                                </span>

                            </div>


                            <div className="activity-card">

                                <div className="activity-icon">
                                    📦
                                </div>

                                <div>
                                    <h3>My Orders</h3>
                                    <p>0 Orders</p>
                                </div>

                                <span className="activity-arrow">
                                    →
                                </span>

                            </div>


                            <div className="activity-card">

                                <div className="activity-icon">
                                    ♡
                                </div>

                                <div>
                                    <h3>Wishlist</h3>
                                    <p>0 Saved</p>
                                </div>

                                <span className="activity-arrow">
                                    →
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        CATEGORIES
                    ========================= */}

                    <section
                        className="buyer-section"
                        id="categories"
                    >

                        <div className="section-header">

                            <h2>
                                Browse Categories
                            </h2>

                            <Link to="/products">
                                View All →
                            </Link>

                        </div>


                        <div className="category-grid">

                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>📚</span>
                                <strong>Books</strong>
                            </Link>


                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>💻</span>
                                <strong>Electronics</strong>
                            </Link>


                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>👕</span>
                                <strong>Clothing</strong>
                            </Link>


                            <Link
                                to="/products"
                                className="category-card"
                            >
                                <span>✏️</span>
                                <strong>Stationery</strong>
                            </Link>

                        </div>

                    </section>


                    {/* =========================
                        RECOMMENDED PRODUCTS
                    ========================= */}

                    <section className="buyer-section">

                        <div className="section-header">

                            <h2>
                                Recommended For You
                            </h2>

                            <Link to="/products">
                                View All →
                            </Link>

                        </div>


                        <div className="recommended-grid">


                            {/* PRODUCT 1 */}

                            <div className="recommended-card">

                                <div className="recommended-image">

                                    📚

                                    <button
                                        type="button"
                                        className="wishlist-button"
                                    >
                                        ♡
                                    </button>

                                </div>


                                <div className="recommended-info">

                                    <h3>
                                        University Textbook
                                    </h3>

                                    <p>
                                        Rs. 500
                                    </p>

                                    <button
                                        type="button"
                                        className="cart-button"
                                    >
                                        ADD TO CART
                                    </button>

                                </div>

                            </div>


                            {/* PRODUCT 2 */}

                            <div className="recommended-card">

                                <div className="recommended-image">

                                    🧮

                                    <button
                                        type="button"
                                        className="wishlist-button"
                                    >
                                        ♡
                                    </button>

                                </div>


                                <div className="recommended-info">

                                    <h3>
                                        Scientific Calculator
                                    </h3>

                                    <p>
                                        Rs. 1,200
                                    </p>

                                    <button
                                        type="button"
                                        className="cart-button"
                                    >
                                        ADD TO CART
                                    </button>

                                </div>

                            </div>


                            {/* PRODUCT 3 */}

                            <div className="recommended-card">

                                <div className="recommended-image">

                                    🎒

                                    <button
                                        type="button"
                                        className="wishlist-button"
                                    >
                                        ♡
                                    </button>

                                </div>


                                <div className="recommended-info">

                                    <h3>
                                        Student Backpack
                                    </h3>

                                    <p>
                                        Rs. 800
                                    </p>

                                    <button
                                        type="button"
                                        className="cart-button"
                                    >
                                        ADD TO CART
                                    </button>

                                </div>

                            </div>


                            {/* PRODUCT 4 */}

                            <div className="recommended-card">

                                <div className="recommended-image">

                                    📓

                                    <button
                                        type="button"
                                        className="wishlist-button"
                                    >
                                        ♡
                                    </button>

                                </div>


                                <div className="recommended-info">

                                    <h3>
                                        Notebook Set
                                    </h3>

                                    <p>
                                        Rs. 250
                                    </p>

                                    <button
                                        type="button"
                                        className="cart-button"
                                    >
                                        ADD TO CART
                                    </button>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =========================
                        RECENTLY PURCHASED
                    ========================= */}

                    <RecentlyPurchased />


                </main>

            </div>


            {/* =========================
                COMMON FOOTER
            ========================= */}

            <Footer />

        </>
    );
}
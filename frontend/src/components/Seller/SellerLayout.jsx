import {
    NavLink,
    Link,
    useLocation
} from "react-router-dom";

import SellerNavbar
    from "./SellerNavbar.jsx";

import Footer
    from "../Footer.jsx";

import "../../styles/Seller/SellerLayout.css";


export default function SellerLayout({
    children
}) {

    const location = useLocation();


    const productsActive =
        location.pathname === "/seller/dashboard" &&
        location.hash === "#seller-products";


    const dashboardActive =
        location.pathname === "/seller/dashboard" &&
        location.hash !== "#seller-products";


    return (

        <>

            <div className="seller-layout-page">

                <SellerNavbar />


                <div className="seller-dashboard-layout">


                    <aside className="seller-sidebar">

                        <h3 className="seller-sidebar-title">
                            SELLER PANEL
                        </h3>


                        <nav className="seller-sidebar-menu">


                            {/* DASHBOARD */}

                            <Link
                                to="/seller/dashboard"
                                className={
                                    dashboardActive
                                        ? "seller-menu-link active"
                                        : "seller-menu-link"
                                }
                            >
                                <span>📊</span>

                                Dashboard
                            </Link>


                            {/* PRODUCTS */}

                            <Link
                                to="/seller/dashboard#seller-products"
                                className={
                                    productsActive
                                        ? "seller-menu-link active"
                                        : "seller-menu-link"
                                }
                            >
                                <span>📦</span>

                                Products
                            </Link>


                            {/* ORDERS */}

                            <NavLink
                                to="/seller/orders"
                                className={({ isActive }) =>
                                    isActive
                                        ? "seller-menu-link active"
                                        : "seller-menu-link"
                                }
                            >
                                <span>🛒</span>

                                Orders
                            </NavLink>


                            {/* SALES */}

                            <NavLink
                                to="/seller/sales"
                                className={({ isActive }) =>
                                    isActive
                                        ? "seller-menu-link active"
                                        : "seller-menu-link"
                                }
                            >
                                <span>💰</span>

                                Sales
                            </NavLink>


                        </nav>

                    </aside>


                    <main className="seller-layout-main">

                        {children}

                    </main>


                </div>

            </div>


            <Footer />

        </>

    );
}
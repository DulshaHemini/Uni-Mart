import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";

import Products from "./pages/Product/Products.jsx";
import ProductDetails from "./components/Product/ProductDetails.jsx";

import ProtectedRoute from "./components/Product/ProtectedRoute.jsx";

import BuyerHome from "./pages/Buyer/BuyerHome.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Profile from "./pages/Buyer/Profile.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import MyOrders from "./pages/Buyer/MyOrders.jsx";
import Wishlist from "./pages/Buyer/Wishlist.jsx";
import AccountSettings from "./pages/Buyer/AccountSettings.jsx";
import Chat from "./pages/Buyer/Chat.jsx";

import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import SellerProfile from "./pages/Seller/SellerProfile.jsx";
import AddProduct from "./pages/Seller/AddProduct.jsx";
import EditProduct from "./pages/Seller/EditProduct.jsx";
import SellerSettings from "./pages/Seller/SellerSettings.jsx";
import SellerOrders from "./pages/Seller/SellerOrders.jsx";
import SellerSales from "./pages/Seller/SellerSales.jsx";

import OrderConfirmation from "./pages/Payment/OrderConfirmation.jsx";
import PaymentCancel from "./pages/Payment/PaymentCancel.jsx";

import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import AdminProducts from "./pages/Admin/AdminProducts.jsx";
import AdminEditProduct from "./pages/Admin/AdminEditProduct.jsx";
import AdminInventory from "./pages/Admin/AdminInventory.jsx";
import AdminOrders from "./pages/Admin/AdminOrders.jsx";
import AdminOrderDetails from "./pages/Admin/AdminOrderDetails.jsx";
import AdminUsers from "./pages/Admin/AdminUsers.jsx";
import HelpCenter from "./pages/Help/HelpCenter.jsx";
import Contact from "./pages/Help/Contact.jsx";
import Privacy from "./pages/Help/Privacy.jsx";

import AdminProfile from "./pages/Admin/AdminProfile.jsx";
import AdminSettings from "./pages/Admin/AdminSettings.jsx";

import NotFound from "./pages/NotFound.jsx";


function App() {

    return (

        <BrowserRouter>

            <Routes>


                {/* =========================
                    PUBLIC / SHARED ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={
                        <Home />
                    }
                />


                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />


                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                <Route
                    path="/products"
                    element={
                        <Products />
                    }
                />


                <Route
                    path="/products/:id"
                    element={
                        <ProductDetails />
                    }
                />



                {/* =========================
                    BUYER ROUTES
                ========================= */}

                <Route
                    path="/buyer"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <BuyerHome />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <Cart />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <Profile />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/checkout"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <MyOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/wishlist"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <Wishlist />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <AccountSettings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat"
                    element={
                        <ProtectedRoute
                            allowedRoles={["buyer"]}
                        >
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                {/* PAYMENT RESULT ROUTES */}

                <Route
                    path="/order-confirmation"
                    element={
                        <OrderConfirmation />
                    }
                />


                <Route
                    path="/payment-cancel"
                    element={
                        <PaymentCancel />
                    }
                />

                



                {/* =========================
                    SELLER ROUTES
                ========================= */}

                <Route
                    path="/seller/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <SellerDashboard />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/seller/add-product"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <AddProduct />
                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/seller/edit-product/:id"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <EditProduct />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <SellerProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/settings"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <SellerSettings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/orders"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <SellerOrders />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/sales"
                    element={
                        <ProtectedRoute
                            allowedRoles={["seller"]}
                        >
                            <SellerSales />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    ADMIN ROUTES
                ========================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute
                            allowedRoles={["admin"]}
                        >
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                path="/admin/products"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminProducts />
                    </ProtectedRoute>
                }
                 />

                <Route
                path="/admin/products/:id/edit"
                element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminEditProduct />
                    </ProtectedRoute>
                }
                />

                <Route
                    path="/admin/inventory"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminInventory />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/orders"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminOrders />
                        </ProtectedRoute>
                    }
                />

                    <Route
                    path="/admin/orders/:id"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminOrderDetails />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/profile"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminProfile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminSettings />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contact"
                    element={<Contact />}
                />

                <Route
                    path="/help-center"
                    element={<HelpCenter />}
                />

                <Route
                    path="/privacy"
                    element={<Privacy />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

            

        </BrowserRouter>

    );

}


export default App;
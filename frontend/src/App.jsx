import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Products from "./pages/Product/Products.jsx";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import ProtectedRoute from "./components/Product/ProtectedRoute.jsx";

import BuyerHome from "./pages/Buyer/BuyerHome.jsx";
import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import EditProduct from "./pages/Seller/EditProduct.jsx";
import AddProduct from "./pages/Seller/AddProduct.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";
import Cart from "./pages/Cart/Cart.jsx";
import Profile from "./pages/Profile/Profile.jsx";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* =========================
                    PUBLIC / SHARED ROUTES
                ========================= */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />


                {/* =========================
                    BUYER ROUTES
                ========================= */}

                <Route
                    path="/buyer"
                    element={
                        <ProtectedRoute allowedRoles={["buyer"]}>
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
                    <ProtectedRoute allowedRoles={["buyer"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

                    
                

                {/* =========================
                    SELLER ROUTES
                ========================= */}

                <Route
                    path="/seller/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["seller"]}>
                            <SellerDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/add-product"
                    element={
                        <ProtectedRoute allowedRoles={["seller"]}>
                            <AddProduct />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/seller/edit-product/:id"
                    element={
                        <ProtectedRoute allowedRoles={["seller"]}>
                            <EditProduct />
                        </ProtectedRoute>
                    }
                />

                {/* =========================
                    ADMIN ROUTES
                ========================= */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />


                

            </Routes>

        </BrowserRouter>
    );
}

export default App;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Products from "./pages/Products.jsx";
import ProductDetails from "./components/ProductDetails.jsx";

import ProtectedRoute from "./components/ProtectedRoute.jsx";

import BuyerHome from "./pages/Buyer/BuyerHome.jsx";
import SellerDashboard from "./pages/Seller/SellerDashboard.jsx";
import AdminDashboard from "./pages/Admin/AdminDashboard.jsx";


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
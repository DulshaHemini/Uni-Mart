import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Auth/Login.jsx";
import Register from "./pages/Auth/Register.jsx";
import Products from "./pages/Product/Products.jsx";
import ProductDetails from "./components/Product/ProductDetails.jsx";
import ProtectedRoute from "./components/Product/ProtectedRoute.jsx";

import Cart from "./pages/Cart/Cart.jsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>

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

                <Route
                    path="/cart"
                    element={
                        <ProtectedRoute allowedRoles={["buyer"]}>
                            <Cart />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import "../../styles/Login/Login.css"

import Notification from "../../components/Notification.jsx";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [loading, setLoading] = useState(false);

    const [notification, setNotification] = useState(null);


    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // ================================
        // Login Validation
        // ================================

        if (!email.trim()) {

            setError("Please enter your email.");

            return;

        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {

            setError("Please enter a valid email address.");

            return;

        }

        if (!password) {

            setError("Please enter your password.");

            return;

        }


        try {

            setLoading(true);


            // ================================
            // Login API Request
            // ================================

            const response = await fetch(
                "http://localhost:5000/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email.trim().toLowerCase(),
                        password: password
                    })
                }
            );


            const data = await response.json();
        

            // ================================
            // Login Failed
            // ================================

            if (!response.ok) {

                setError(
                    data.message || "Login failed."
                );

                return;

            }


            // ================================
            // Save JWT
            // ================================

            localStorage.setItem(
                "token",
                data.token
            );


            // ================================
            // Save Logged-in User
            // ================================

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );


            // ================================
            // Success Notification
            // ================================

            setNotification({

                type: "success",

                message: "Login successful!"

            });


            // ================================
            // Redirect According to Role
            // ================================

            setTimeout(() => {

                if (data.user.role === "buyer") {

                    navigate("/buyer");

                } else if (data.user.role === "seller") {

                    navigate("/seller/dashboard");

                } else if (data.user.role === "admin") {

                    navigate("/admin/dashboard");

                }

            }, 2500);


        } catch (error) {

            console.error(error);

            setError(
                "Unable to connect to the server."
            );

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            {/* Success Notification */}

            {notification && (

                <Notification
                    type={notification.type}
                    message={notification.message}
                />

            )}


            <header className="login-header">

                <Link
                    to="/"
                    className="login-logo"
                >

                    <span className="logo-uni">
                        Uni
                    </span>

                    <span className="logo-mart">
                        Mart
                    </span>

                </Link>

            </header>


            <main className="login-container">

                <div className="login-card">

                    <h1>
                        Welcome Back
                    </h1>


                    <form onSubmit={handleSubmit}>

                        {/* Email */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                required
                            />

                        </div>


                        {/* Password */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                required
                            />

                        </div>


                        {/* Error */}

                        {error && (

                            <p className="login-error">
                                {error}
                            </p>

                        )}


                        {/* Login Button */}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >

                            {loading
                                ? "LOGGING IN..."
                                : "LOGIN"
                            }

                        </button>

                    </form>


                    {/* Forgot Password */}

                    <Link
                        to="/forgot-password"
                        className="forgot-password"
                    >
                        Forgot Password?
                    </Link>


                    {/* Register */}

                    <p className="register-text">

                        Don't have an account?{" "}

                        <Link to="/register">
                            Register
                        </Link>

                    </p>

                </div>

            </main>

        </div>

    );

}

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "../../styles/Register/Register.css";
import Notification from "../../components/Notification.jsx";

export default function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState(null);


    // ================================
    // Handle Input Changes
    // ================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // ================================
    // Register User
    // ================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");


        // ================================
        // Registration Validation
        // ================================

        // First Name

        if (!formData.firstName.trim()) {

            setError("Please enter your first name.");
            return;

        }

        if (!/^[A-Za-z\s]+$/.test(formData.firstName.trim())) {

            setError("First name can contain letters only.");
            return;

        }


        // Last Name

        if (!formData.lastName.trim()) {

            setError("Please enter your last name.");
            return;

        }

        if (!/^[A-Za-z\s]+$/.test(formData.lastName.trim())) {

            setError("Last name can contain letters only.");
            return;

        }


        // Email

        if (!formData.email.trim()) {

            setError("Please enter your email.");
            return;

        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {

            setError("Please enter a valid email address.");
            return;

        }


        // Phone Number

        if (!formData.phone.trim()) {

            setError("Please enter your phone number.");
            return;

        }

        if (!/^07\d{8}$/.test(formData.phone.trim())) {

            setError("Please enter a valid Sri Lankan phone number.");
            return;

        }


        // Password

        if (!formData.password) {

            setError("Please enter a password.");
            return;

        }

        if (formData.password.length < 8) {

            setError("Password must be at least 8 characters.");
            return;

        }


        // Confirm Password

        if (!formData.confirmPassword) {

            setError("Please confirm your password.");
            return;

        }

        if (formData.password !== formData.confirmPassword) {

            setError("Passwords do not match.");
            return;

        }


        // ================================
        // Send Registration Request
        // ================================

        try {

            setLoading(true);


            const response = await fetch(
                "http://localhost:5000/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        first_name: formData.firstName.trim(),
                        last_name: formData.lastName.trim(),
                        email: formData.email.trim().toLowerCase(),
                        phone_number: formData.phone.trim(),
                        password: formData.password
                    })
                }
            );


            const data = await response.json();


            // ================================
            // Registration Failed
            // ================================

            if (!response.ok) {

            if (data.message === "Email already exists") {

                setNotification({
                    type: "error",
                    message: "User already exists. Please log in to your account."
                });

                setTimeout(() => {
                    setNotification(null);
                }, 250);

            } else {

                setError(
                    data.message || "Registration failed."
                );

            }

            return;
        }

            // ================================
            // Registration Successful
            // ================================

            setNotification({
                type: "success",
                message: "Registration successful!"
            });


            // Redirect to Login after 2.5 seconds

            setTimeout(() => {

                navigate("/login");

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

        <div className="register-page">

            {/* Success Notification */}

            {notification && (

                <Notification
                    type={notification.type}
                    message={notification.message}
                />

            )}


            {/* Header */}

            <header className="register-header">

                <Link to="/" className="register-logo">

                    <span className="logo-uni">
                        Uni
                    </span>

                    <span className="logo-mart">
                        Mart
                    </span>

                </Link>

            </header>


            {/* Register Container */}

            <main className="register-container">

                <div className="register-card">

                    <h1>Create Account</h1>


                    <form onSubmit={handleSubmit}>

                        {/* Name */}

                        <div className="name-row">

                            <div className="form-group">

                                <label htmlFor="firstName">
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="lastName">
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Phone */}

                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                placeholder="Enter phone number"
                                value={formData.phone}
                                onChange={handleChange}
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
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Confirm Password */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* Error */}

                        {error && (

                            <p className="register-error">
                                {error}
                            </p>

                        )}


                        {/* Register Button */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading
                                ? "REGISTERING..."
                                : "REGISTER"
                            }

                        </button>

                    </form>


                    {/* Login Link */}

                    <p className="login-text">

                        Already have an account?{" "}

                        <Link to="/login">
                            Login
                        </Link>

                    </p>

                </div>

            </main>

        </div>

    );

}


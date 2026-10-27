
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/Help/Contact.css";

const initialForm = {
    name: "",
    email: "",
    topic: "General Inquiry",
    subject: "",
    message: ""
};

export default function Contact() {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));

        setError("");
        setNotice("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.subject.trim() ||
            !form.message.trim()
        ) {
            setError("Please complete all required fields.");
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(form.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        // The backend contact endpoint has not been connected yet.
        setNotice(
            "Your form is valid, but your message has not been sent. Contact submission is not connected yet."
        );
    }

    return (
        <>
            <Navbar />

            <main className="contact-page">
                <section className="contact-hero">
                    <span className="contact-eyebrow">
                        UNIMART SUPPORT
                    </span>

                    <h1>Contact Us</h1>

                    <p>
                        Have a question or facing a problem?
                        Tell us what you need help with.
                    </p>
                </section>

                <section className="contact-content">
                    <div className="contact-info">
                        <h2>How can we help?</h2>

                        <p>
                            Use the form to describe your question
                            about buying, selling, orders, or your account.
                        </p>

                        <div className="contact-info-card">
                            <span>🛒</span>
                            <div>
                                <h3>Buying and Orders</h3>
                                <p>
                                    Questions about products, checkout,
                                    or existing orders.
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <span>🏷️</span>
                            <div>
                                <h3>Selling on UniMart</h3>
                                <p>
                                    Questions about product listings
                                    and seller features.
                                </p>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <span>🔐</span>
                            <div>
                                <h3>Account Support</h3>
                                <p>
                                    Questions about registration,
                                    login, or account settings.
                                </p>
                            </div>
                        </div>

                        <div className="contact-help-link">
                            <p>Looking for a quick answer?</p>
                            <Link to="/help-center">
                                Visit the Help Center →
                            </Link>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <h2>Send a Message</h2>
                        <br />
                        <p className="contact-form-description">
                            Fields marked with * are required.
                        </p>

                        <form onSubmit={handleSubmit}>
                            <div className="contact-field">
                                <label htmlFor="contact-name">
                                    Full Name *
                                </label>
                                <input
                                    id="contact-name"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="Enter your name"
                                    maxLength={100}
                                    required
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-email">
                                    Email Address *
                                </label>
                                <input
                                    id="contact-email"
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    maxLength={150}
                                    required
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-topic">
                                    Topic *
                                </label>
                                <select
                                    id="contact-topic"
                                    name="topic"
                                    value={form.topic}
                                    onChange={handleChange}
                                    required
                                >
                                    <option>General Inquiry</option>
                                    <option>Buying and Orders</option>
                                    <option>Selling Products</option>
                                    <option>Payment Issue</option>
                                    <option>Account Support</option>
                                    <option>Report a Problem</option>
                                </select>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-subject">
                                    Subject *
                                </label>
                                <input
                                    id="contact-subject"
                                    name="subject"
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="Briefly describe your issue"
                                    maxLength={150}
                                    required
                                />
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-message">
                                    Message *
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Explain how we can help..."
                                    rows={5}
                                    maxLength={2000}
                                    required
                                />
                                <small>
                                    {form.message.length}/2000 characters
                                </small>
                            </div>

                            {error && (
                                <p className="contact-error" role="alert">
                                    {error}
                                </p>
                            )}

                            {notice && (
                                <p className="contact-notice" role="status">
                                    {notice}
                                </p>
                            )}

                            <button
                                className="contact-submit-button"
                                type="submit"
                            >
                                Validate Message
                            </button>
                        </form>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

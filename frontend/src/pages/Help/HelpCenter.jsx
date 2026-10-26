
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/Help/HelpCenter.css";

const helpTopics = [
    {
        icon: "👤",
        question: "How do I create a UniMart account?",
        answer:
            "Open the Register page, enter the required details, and submit the form. If you already have an account, use the Login page."
    },
    {
        icon: "🔎",
        question: "How do I find a product?",
        answer:
            "Open Products to browse available items. You can use the search and category filters to find products you are interested in."
    },
    {
        icon: "🛒",
        question: "How do I buy a product?",
        answer:
            "Open a product, review its details, and follow the available add-to-cart and checkout steps. Complete the checkout process to place your order."
    },
    {
        icon: "🏷️",
        question: "How can I sell products?",
        answer:
            "Register or log in with a seller account, then open the seller dashboard to manage your product listings."
    },
    {
        icon: "📦",
        question: "Where can I check my orders?",
        answer:
            "Log in to your buyer account and open My Orders to check the orders associated with your account."
    },
    {
        icon: "💳",
        question: "What if my payment does not complete?",
        answer:
            "Check the payment result shown by UniMart first. If the order or payment status looks incorrect, avoid paying again until you have checked the existing order status."
    },
    {
        icon: "🔐",
        question: "What should I do if I cannot log in?",
        answer:
            "Check that your email and password are correct. If you still cannot log in, check whether your account details are correct or contact the UniMart project support team."
    }
];

export default function HelpCenter() {
    return (
        <>
            <Navbar />

            <main className="help-center-page">
                <section className="help-center-hero">
                    <span className="help-center-label">
                        UNIMART SUPPORT
                    </span>

                    <h1>How can we help you?</h1>

                    <p>
                        Find answers to common questions about
                        buying, selling, orders, and your account.
                    </p>

                    <Link to="/products" className="help-browse-button">
                        Browse Products
                    </Link>
                </section>

                <section className="help-center-content">
                    <div className="help-section-heading">
                        <h2>Frequently Asked Questions</h2>
                        <p>
                            Select a question to view its answer.
                        </p>
                    </div>

                    <div className="help-faq-list">
                        {helpTopics.map((topic, index) => (
                            <details
                                className="help-faq-item"
                                key={topic.question}
                                open={index === 0}
                            >
                                <summary>
                                    <span className="help-faq-icon">
                                        {topic.icon}
                                    </span>

                                    <span className="help-faq-question">
                                        {topic.question}
                                    </span>

                                    <span className="help-faq-arrow">
                                        +
                                    </span>
                                </summary>

                                <p className="help-faq-answer">
                                    {topic.answer}
                                </p>
                            </details>
                        ))}
                    </div>

                    <div className="help-contact-card" id="contact">
                        <span className="help-contact-icon">💬</span>

                        <div>
                            <h2>Still need help?</h2>
                            <p>
                                If you cannot find your answer here,
                                contact the UniMart project support team
                                through the support channel provided by
                                your project administrators.
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}

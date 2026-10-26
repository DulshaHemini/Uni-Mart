
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar.jsx";
import Footer from "../../components/Footer.jsx";
import "../../styles/Help/Privacy.css";

const sections = [
    {
        title: "1. Information We Collect",
        paragraphs: [
            "When you use UniMart, you may provide information such as your name, email address, account details, delivery information, and information about products you list or orders you place.",
            "The application may also process information needed to operate its features, such as product listings, order records, and account activity. The exact information collected depends on the features you use."
        ]
    },
    {
        title: "2. How We Use Information",
        paragraphs: [
            "Information may be used to create and manage accounts, display product listings, process orders, support buying and selling, maintain application security, and respond to user questions.",
            "UniMart should use personal information only for appropriate purposes related to operating and improving the marketplace."
        ]
    },
    {
        title: "3. Sharing of Information",
        paragraphs: [
            "Information may be shared when necessary to support marketplace activities. For example, certain order or delivery details may need to be available to the relevant buyer or seller.",
            "Information should not be made publicly available unless it is necessary for a marketplace feature or the user has been appropriately informed. Any third-party services used by UniMart should be reviewed for their own data-handling practices."
        ]
    },
    {
        title: "4. Payments and Orders",
        paragraphs: [
            "Payment processing may involve an external payment provider. Payment information should be handled according to the provider's policies and the application's actual payment integration.",
            "Order information may be retained so users can view order history and administrators can manage marketplace transactions."
        ]
    },
    {
        title: "5. Account Security",
        paragraphs: [
            "Users should keep their login credentials private and use a strong password. UniMart should apply appropriate safeguards to protect account information.",
            "No online application can guarantee absolute security. If you believe your account has been accessed without permission, use the available account-support options."
        ]
    },
    {
        title: "6. Data Retention",
        paragraphs: [
            "Information should be retained only for as long as reasonably necessary for marketplace operations, account management, order records, security, and applicable obligations.",
            "The retention periods and deletion procedures depend on the final backend implementation and the policies adopted by the UniMart project team."
        ]
    },
    {
        title: "7. Your Privacy Choices",
        paragraphs: [
            "Keep your account information accurate and avoid including unnecessary personal details in product listings or messages.",
            "If you want to ask about your personal information or request a correction, contact the UniMart project team through the available support channel. Requests will need to be handled according to the application's capabilities and applicable requirements."
        ]
    },
    {
        title: "8. Children's Privacy",
        paragraphs: [
            "UniMart is intended to be used in accordance with the eligibility and account rules established by the project team. Do not submit another person's personal information without an appropriate reason and permission."
        ]
    },
    {
        title: "9. Changes to This Policy",
        paragraphs: [
            "This policy may be updated when UniMart's features or data-handling practices change. The project team should update the policy and its effective date whenever a material change is made."
        ]
    }
];

export default function Privacy() {
    return (
        <>
            <Navbar />

            <main className="privacy-page">
                <header className="privacy-hero">
                    <span className="privacy-eyebrow">
                        UNIMART POLICIES
                    </span>

                    <h1>Privacy Policy</h1>

                    <p>
                        Learn how information may be handled when
                        you use the UniMart student marketplace.
                    </p>

                    <span className="privacy-updated">
                        Project draft · Review before publication
                    </span>
                </header>

                <div className="privacy-layout">
                    <aside className="privacy-toc">
                        <h2>On this page</h2>

                        {sections.map((section, index) => (
                            <a
                                key={section.title}
                                href={`#privacy-section-${index + 1}`}
                            >
                                {section.title}
                            </a>
                        ))}
                    </aside>

                    <article className="privacy-document">
                        <div className="privacy-notice">
                            <strong>Important:</strong> This is a
                            starter policy for the project. Confirm
                            that it accurately describes your actual
                            backend, database, and payment integration
                            before publishing it as an official policy.
                        </div>

                        {sections.map((section, index) => (
                            <section
                                className="privacy-section"
                                id={`privacy-section-${index + 1}`}
                                key={section.title}
                            >
                                <h2>{section.title}</h2>

                                {section.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </section>
                        ))}

                        <div className="privacy-contact">
                            <h2>Questions about privacy?</h2>

                            <p>
                                Visit our Contact page to find the
                                available support options.
                            </p>

                            <Link to="/contact">
                                Contact UniMart →
                            </Link>
                        </div>
                    </article>
                </div>
            </main>

            <Footer />
        </>
    );
}

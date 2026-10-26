import BuyerNavbar
    from "../../components/Buyer/BuyerNavbar.jsx";

import Footer
    from "../../components/Footer.jsx";

import "../../styles/Buyer/Chat.css";


export default function Chat() {

    return (

        <>

            <BuyerNavbar />


            <main className="buyer-chat-page">

                <div className="buyer-chat-container">

                    <div className="buyer-chat-card">

                        <div className="buyer-chat-icon">
                            💬
                        </div>


                        <h1>
                            Chat with Seller
                        </h1>


                        <p>
                            Buyer and seller messaging
                            will be available here.
                        </p>


                        <div className="buyer-chat-notice">

                            <strong>
                                Messaging Feature
                            </strong>

                            <span>
                                This feature is currently
                                being prepared for UniMart.
                            </span>

                        </div>

                    </div>

                </div>

            </main>


            <Footer />

        </>

    );
}
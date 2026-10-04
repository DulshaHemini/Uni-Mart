import {
    Link,
    useSearchParams
} from "react-router-dom";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/Payment/PaymentResult.css";


export default function PaymentCancel() {

    const [searchParams] =
        useSearchParams();


    const orderId =
        searchParams.get("order_id");


    return (

        <>

            <BuyerNavbar />


            <main className="payment-result-page">

                <div className="payment-result-card">

                    <div className="payment-result-icon cancelled">
                        !
                    </div>


                    <h1>
                        Payment Cancelled
                    </h1>


                    <p>
                        Your payment was not completed.
                    </p>


                    {orderId && (

                        <div className="payment-order-id">

                            <span>
                                Order ID
                            </span>

                            <strong>
                                {orderId}
                            </strong>

                        </div>

                    )}


                    <p>
                        No successful payment has been recorded for this order.
                    </p>


                    <div className="payment-result-actions">

                        <Link
                            to="/checkout"
                            className="payment-result-primary"
                        >
                            Try Again
                        </Link>


                        <Link
                            to="/cart"
                            className="payment-result-secondary"
                        >
                            Back to Cart
                        </Link>

                    </div>

                </div>

            </main>


            <Footer />

        </>

    );

}
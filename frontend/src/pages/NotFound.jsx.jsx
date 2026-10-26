import {
    Link
} from "react-router-dom";

import "../styles/NotFound.css";


export default function NotFound() {

    return (

        <main className="not-found-page">

            <div className="not-found-card">

                <div className="not-found-code">
                    404
                </div>


                <h1>
                    Page Not Found
                </h1>


                <p>
                    The page you are looking for
                    does not exist or may have been moved.
                </p>


                <Link
                    to="/"
                    className="not-found-button"
                >
                    Go to Home
                </Link>

            </div>

        </main>

    );
}
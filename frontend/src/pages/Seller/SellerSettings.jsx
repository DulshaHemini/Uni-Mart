import {
    useState
} from "react";

import SellerNavbar
    from "../../components/Seller/SellerNavbar.jsx";

import Footer
    from "../../components/Footer.jsx";

import Notification
    from "../../components/Notification.jsx";

import "../../styles/Seller/SellerSettings.css";


export default function SellerSettings() {

    const token =
        localStorage.getItem("token");


    const [passwordForm, setPasswordForm] =
        useState({
            current_password: "",
            new_password: "",
            confirm_password: ""
        });


    const [changingPassword, setChangingPassword] =
        useState(false);


    const [notification, setNotification] =
        useState(null);


    const showNotification = (
        type,
        message
    ) => {

        setNotification({
            type,
            message
        });


        setTimeout(() => {

            setNotification(null);

        }, 2500);

    };


    const handlePasswordChange =
        (event) => {

        const {
            name,
            value
        } = event.target;


        setPasswordForm(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

    };


    const handlePasswordSubmit =
        async (event) => {

        event.preventDefault();


        if (
            !passwordForm.current_password ||
            !passwordForm.new_password ||
            !passwordForm.confirm_password
        ) {

            showNotification(
                "error",
                "Please complete all password fields."
            );

            return;

        }


        if (
            passwordForm.new_password.length < 8
        ) {

            showNotification(
                "error",
                "New password must contain at least 8 characters."
            );

            return;

        }


        if (
            passwordForm.new_password !==
            passwordForm.confirm_password
        ) {

            showNotification(
                "error",
                "New passwords do not match."
            );

            return;

        }


        setChangingPassword(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/users/change-password",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            current_password:
                                passwordForm.current_password,

                            new_password:
                                passwordForm.new_password
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to change password"
                );

            }


            setPasswordForm({
                current_password: "",
                new_password: "",
                confirm_password: ""
            });


            showNotification(
                "success",
                "Password changed successfully."
            );


        } catch (error) {

            showNotification(
                "error",
                error.message
            );


        } finally {

            setChangingPassword(false);

        }

    };


    return (

        <>

            <SellerNavbar />


            <main className="seller-settings-page">

                <div className="seller-settings-container">


                    <div className="seller-settings-header">

                        <h1>
                            Settings
                        </h1>

                        <p>
                            Manage your seller account
                            security settings.
                        </p>

                    </div>


                    <section className="seller-settings-card">

                        <div className="seller-settings-card-header">

                            <div>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Keep your seller account
                                    secure by using a strong
                                    password.
                                </p>

                            </div>

                            <span className="seller-settings-icon">
                                🔒
                            </span>

                        </div>


                        <form
                            onSubmit={
                                handlePasswordSubmit
                            }
                        >

                            <div className="seller-settings-password-grid">


                                <div className="seller-settings-field">

                                    <label>
                                        Current Password
                                    </label>

                                    <input
                                        type="password"
                                        name="current_password"
                                        value={
                                            passwordForm.current_password
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter current password"
                                        required
                                    />

                                </div>


                                <div className="seller-settings-field">

                                    <label>
                                        New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="new_password"
                                        value={
                                            passwordForm.new_password
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Enter new password"
                                        minLength="8"
                                        required
                                    />

                                    <small>
                                        Minimum 8 characters
                                    </small>

                                </div>


                                <div className="seller-settings-field">

                                    <label>
                                        Confirm New Password
                                    </label>

                                    <input
                                        type="password"
                                        name="confirm_password"
                                        value={
                                            passwordForm.confirm_password
                                        }
                                        onChange={
                                            handlePasswordChange
                                        }
                                        placeholder="Confirm new password"
                                        minLength="8"
                                        required
                                    />

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="seller-settings-save"
                                disabled={
                                    changingPassword
                                }
                            >

                                {
                                    changingPassword
                                        ? "Changing Password..."
                                        : "Change Password"
                                }

                            </button>

                        </form>

                    </section>


                    <section className="seller-settings-card">

                        <h2>
                            Account Security
                        </h2>


                        <div className="seller-security-info">

                            <div className="seller-security-item">

                                <span>
                                    🛡️
                                </span>

                                <div>

                                    <strong>
                                        Protect Your Account
                                    </strong>

                                    <p>
                                        Never share your UniMart
                                        password with other users.
                                    </p>

                                </div>

                            </div>


                            <div className="seller-security-item">

                                <span>
                                    🔐
                                </span>

                                <div>

                                    <strong>
                                        Strong Password
                                    </strong>

                                    <p>
                                        Use a password that is
                                        different from passwords
                                        used on other websites.
                                    </p>

                                </div>

                            </div>

                        </div>

                    </section>


                </div>

            </main>


            <Footer />


            {notification && (

                <Notification
                    type={
                        notification.type
                    }
                    message={
                        notification.message
                    }
                />

            )}

        </>

    );
}
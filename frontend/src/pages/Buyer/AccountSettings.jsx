import {
    useState
} from "react";

import BuyerNavbar
    from "../../components/Buyer/BuyerNavbar.jsx";

import Footer
    from "../../components/Footer.jsx";

import Notification
    from "../../components/Notification.jsx";

import "../../styles/Buyer/AccountSettings.css";


export default function AccountSettings() {

    const token =
        localStorage.getItem("token");


    // =========================
    // STATES
    // =========================

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


    // =========================
    // NOTIFICATION
    // =========================

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


    // =========================
    // INPUT CHANGE
    // =========================

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


    // =========================
    // CHANGE PASSWORD
    // =========================

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

            <BuyerNavbar />


            <main className="account-settings-page">

                <div className="account-settings-container">


                    {/* =========================
                        PAGE HEADER
                    ========================= */}

                    <div className="settings-heading">

                        <h1>
                            Account Settings
                        </h1>

                        <p>
                            Manage your account
                            security settings.
                        </p>

                    </div>


                    {/* =========================
                        SECURITY
                    ========================= */}

                    <section className="settings-card">

                        <div className="settings-card-header">

                            <div>

                                <h2>
                                    Change Password
                                </h2>

                                <p>
                                    Update your password
                                    to keep your account secure.
                                </p>

                            </div>

                            <div className="settings-security-icon">
                                🔒
                            </div>

                        </div>


                        <form
                            onSubmit={
                                handlePasswordSubmit
                            }
                        >

                            <div className="settings-password-fields">


                                <div className="settings-field">

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


                                <div className="settings-field">

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


                                <div className="settings-field">

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
                                className="settings-password-button"
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


                    {/* =========================
                        SECURITY INFORMATION
                    ========================= */}

                    <section className="settings-card">

                        <h2>
                            Account Security
                        </h2>

                        <div className="settings-security-info">

                            <div className="security-info-item">

                                <span className="security-info-icon">
                                    🛡️
                                </span>

                                <div>

                                    <strong>
                                        Password Security
                                    </strong>

                                    <p>
                                        Use a strong password
                                        that you do not use on
                                        other websites.
                                    </p>

                                </div>

                            </div>


                            <div className="security-info-item">

                                <span className="security-info-icon">
                                    🔐
                                </span>

                                <div>

                                    <strong>
                                        Account Protection
                                    </strong>

                                    <p>
                                        Never share your UniMart
                                        password with another user.
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
                    onCancel={() =>
                        setNotification(null)
                    }
                />

            )}

        </>

    );
}
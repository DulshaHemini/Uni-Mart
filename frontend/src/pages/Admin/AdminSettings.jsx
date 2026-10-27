
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Admin/AdminSettings.css";

const API_URL = "http://localhost:5000/api";

export default function AdminSettings() {
    const navigate = useNavigate();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        setMessage("");
        setMessageType("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage("Please fill in all password fields.");
            setMessageType("error");
            return;
        }

        if (newPassword.length < 8) {
            setMessage("Your new password must contain at least 8 characters.");
            setMessageType("error");
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("The new password and confirmation do not match.");
            setMessageType("error");
            return;
        }

        if (currentPassword === newPassword) {
            setMessage("Your new password must be different from your current password.");
            setMessageType("error");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setMessage("Your session has expired. Please log in again.");
            setMessageType("error");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                `${API_URL}/users/change-password`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword,
                    }),
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    data.error ||
                    `Unable to change password (${response.status}).`
                );
            }

            setMessage(data.message || "Password changed successfully.");
            setMessageType("success");

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            setMessage(
                error.message ||
                "Something went wrong. Please try again."
            );
            setMessageType("error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-settings-page">
            <header className="admin-settings-topbar">
                <Link
                    to="/admin/dashboard"
                    className="admin-settings-brand"
                >
                    <span className="admin-settings-brand-icon">U</span>
                    <span>
                        <strong>UniMart</strong>
                        <small>Administrator Portal</small>
                    </span>
                </Link>

                <button
                    type="button"
                    className="admin-settings-back"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Dashboard
                </button>
            </header>

            <main className="admin-settings-main">
                <div className="admin-settings-heading">
                    <span className="admin-settings-eyebrow">
                        ACCOUNT MANAGEMENT
                    </span>

                    <h1>Settings</h1>

                    <p>
                        Manage your administrator account security.
                    </p>
                </div>

                <div className="admin-settings-layout">
                    <aside className="admin-settings-menu">
                        <h3>Account</h3>

                        <Link to="/admin/profile">
                            <span>👤</span>
                            Profile
                        </Link>

                        <Link
                            to="/admin/settings"
                            className="active"
                        >
                            <span>🔒</span>
                            Password & Security
                        </Link>
                    </aside>

                    <section className="admin-settings-card">
                        <div className="admin-settings-card-heading">
                            <div className="admin-settings-lock-icon">
                                🔐
                            </div>

                            <div>
                                <h2>Change Password</h2>
                                <p>
                                    Choose a strong password to protect
                                    your administrator account.
                                </p>
                            </div>
                        </div>

                        {message && (
                            <div
                                className={`admin-settings-message ${messageType}`}
                                role="status"
                            >
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="admin-settings-field">
                                <label htmlFor="currentPassword">
                                    Current Password
                                </label>

                                <input
                                    id="currentPassword"
                                    type="password"
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={(event) =>
                                        setCurrentPassword(event.target.value)
                                    }
                                    placeholder="Enter current password"
                                    required
                                />
                            </div>

                            <div className="admin-settings-field">
                                <label htmlFor="newPassword">
                                    New Password
                                </label>

                                <input
                                    id="newPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(event) =>
                                        setNewPassword(event.target.value)
                                    }
                                    placeholder="Enter new password"
                                    minLength={8}
                                    required
                                />

                                <small>
                                    Use at least 8 characters.
                                </small>
                            </div>

                            <div className="admin-settings-field">
                                <label htmlFor="confirmPassword">
                                    Confirm New Password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(event) =>
                                        setConfirmPassword(event.target.value)
                                    }
                                    placeholder="Re-enter new password"
                                    minLength={8}
                                    required
                                />
                            </div>

                            <div className="admin-settings-actions">
                                <button
                                    type="submit"
                                    className="admin-settings-save"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Updating..."
                                        : "Update Password"}
                                </button>

                                <button
                                    type="button"
                                    className="admin-settings-cancel"
                                    disabled={loading}
                                    onClick={() => {
                                        setCurrentPassword("");
                                        setNewPassword("");
                                        setConfirmPassword("");
                                        setMessage("");
                                        setMessageType("");
                                    }}
                                >
                                    Clear
                                </button>
                            </div>
                        </form>

                        <div className="admin-settings-security-note">
                            <strong>Security tip</strong>
                            <p>
                                Never share your password with anyone.
                                If the change fails, check the error
                                message and your current password.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

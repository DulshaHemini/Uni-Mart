
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Admin/AdminProfile.css";

const API_URL = "http://localhost:5000/api";

export default function AdminProfile() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [profile, setProfile] = useState({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        role: "",
        created_at: ""
    });

    const [originalProfile, setOriginalProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetch(
                    `${API_URL}/users/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Unable to load Admin profile."
                    );
                }

                if (!data.user) {
                    throw new Error("Profile information was not returned.");
                }

                const user = data.user;

                const profileData = {
                    first_name: user.first_name || "",
                    last_name: user.last_name || "",
                    email: user.email || "",
                    phone_number: user.phone_number || "",
                    role: user.role || "",
                    created_at: user.created_at || ""
                };

                setProfile(profileData);
                setOriginalProfile(profileData);
            } catch (err) {
                setError(err.message || "Unable to load profile.");
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            loadProfile();
        } else {
            setError("Please log in to view your profile.");
            setLoading(false);
        }
    }, [token]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setProfile((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleEdit = () => {
        setOriginalProfile({ ...profile });
        setError("");
        setMessage("");
        setEditing(true);
    };

    const handleCancel = () => {
        if (originalProfile) {
            setProfile({ ...originalProfile });
        }

        setEditing(false);
        setError("");
        setMessage("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!profile.first_name.trim() || !profile.last_name.trim()) {
            setError("First name and last name are required.");
            return;
        }

        setSaving(true);

        try {
            const response = await fetch(
                `${API_URL}/users/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        first_name: profile.first_name.trim(),
                        last_name: profile.last_name.trim(),
                        phone_number: profile.phone_number.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to update profile."
                );
            }

            if (!data.user) {
                throw new Error(
                    "The server did not return updated profile information."
                );
            }

            const updatedUser = data.user;

            const updatedProfile = {
                first_name: updatedUser.first_name || "",
                last_name: updatedUser.last_name || "",
                email: updatedUser.email || "",
                phone_number: updatedUser.phone_number || "",
                role: updatedUser.role || "",
                created_at: updatedUser.created_at || ""
            };

            setProfile(updatedProfile);
            setOriginalProfile(updatedProfile);

            const storedUser = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...storedUser,
                    first_name: updatedProfile.first_name,
                    last_name: updatedProfile.last_name,
                    email: updatedProfile.email
                })
            );

            setEditing(false);
            setMessage("Profile updated successfully.");
        } catch (err) {
            setError(err.message || "Unable to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-profile-state">
                Loading Admin profile...
            </div>
        );
    }

    return (
        <div className="admin-profile-page">
            <header className="admin-profile-topbar">
                <button
                    type="button"
                    className="admin-profile-back"
                    onClick={() => navigate("/admin/dashboard")}
                >
                    ← Dashboard
                </button>

                <span className="admin-profile-brand">
                    <span>Uni</span>Mart
                </span>
            </header>

            <main className="admin-profile-content">
                <div className="admin-profile-heading">
                    <div>
                        <p className="admin-profile-eyebrow">
                            ADMINISTRATION
                        </p>
                        <h1>My Profile</h1>
                        <p>
                            View and manage your Admin account information.
                        </p>
                    </div>

                    {!editing && (
                        <button
                            type="button"
                            className="admin-profile-primary"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {error && (
                    <div className="admin-profile-alert error" role="alert">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="admin-profile-alert success" role="status">
                        {message}
                    </div>
                )}

                <section className="admin-profile-card">
                    <div className="admin-profile-card-heading">
                        <div className="admin-profile-avatar">
                            {profile.first_name.charAt(0).toUpperCase() || "A"}
                        </div>

                        <div>
                            <h2>
                                {profile.first_name} {profile.last_name}
                            </h2>
                            <p>{profile.email}</p>
                            <span className="admin-profile-role">
                                {profile.role || "Admin"}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="admin-profile-card">
                    <div className="admin-profile-section-heading">
                        <h2>Account Details</h2>
                        <p>Your registered account information.</p>
                    </div>

                    <div className="admin-profile-account-grid">
                        <div>
                            <span>Email Address</span>
                            <strong>{profile.email || "Not available"}</strong>
                        </div>

                        <div>
                            <span>Account Role</span>
                            <strong>{profile.role || "Admin"}</strong>
                        </div>

                        <div>
                            <span>Member Since</span>
                            <strong>
                                {profile.created_at
                                    ? new Date(
                                          profile.created_at
                                      ).toLocaleDateString()
                                    : "Not available"}
                            </strong>
                        </div>
                    </div>
                </section>

                <section className="admin-profile-card">
                    <div className="admin-profile-section-heading">
                        <h2>Personal Information</h2>
                        <p>
                            Update your name and contact number.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="admin-profile-form-grid">
                            <div className="admin-profile-field">
                                <label htmlFor="admin-first-name">
                                    First Name
                                </label>
                                <input
                                    id="admin-first-name"
                                    name="first_name"
                                    value={profile.first_name}
                                    onChange={handleChange}
                                    disabled={!editing || saving}
                                    required
                                />
                            </div>

                            <div className="admin-profile-field">
                                <label htmlFor="admin-last-name">
                                    Last Name
                                </label>
                                <input
                                    id="admin-last-name"
                                    name="last_name"
                                    value={profile.last_name}
                                    onChange={handleChange}
                                    disabled={!editing || saving}
                                    required
                                />
                            </div>
                        </div>

                        <div className="admin-profile-field">
                            <label htmlFor="admin-email">
                                Email Address
                            </label>
                            <input
                                id="admin-email"
                                type="email"
                                value={profile.email}
                                disabled
                            />
                            <small>
                                Email changes are not supported by this form.
                            </small>
                        </div>

                        <div className="admin-profile-field">
                            <label htmlFor="admin-phone">
                                Phone Number
                            </label>
                            <input
                                id="admin-phone"
                                name="phone_number"
                                type="tel"
                                value={profile.phone_number}
                                onChange={handleChange}
                                disabled={!editing || saving}
                                placeholder="Enter your phone number"
                            />
                        </div>

                        {editing && (
                            <div className="admin-profile-actions">
                                <button
                                    type="button"
                                    className="admin-profile-secondary"
                                    onClick={handleCancel}
                                    disabled={saving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-profile-primary"
                                    disabled={saving}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>
                </section>

                <section className="admin-profile-security">
                    <div>
                        <h2>Account Security</h2>
                        <p>
                            Keep your Admin account secure by updating your
                            password when needed.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="admin-profile-secondary"
                        onClick={() => navigate("/admin/settings")}
                    >
                        Open Settings →
                    </button>
                </section>
            </main>
        </div>
    );
}

import {
    useEffect,
    useState
} from "react";

import SellerNavbar
    from "../../components/Seller/SellerNavbar.jsx";

import Footer
    from "../../components/Footer.jsx";

import Notification
    from "../../components/Notification.jsx";

import "../../styles/Seller/SellerProfile.css";


export default function SellerProfile() {

    const token =
        localStorage.getItem("token");


    const [profile, setProfile] =
        useState({
            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",
            role: "",
            created_at: ""
        });


    const [originalProfile, setOriginalProfile] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [isEditing, setIsEditing] =
        useState(false);

    const [notification, setNotification] =
        useState(null);


    // =========================
    // NOTIFICATION
    // =========================

    const showNotification =
        (type, message) => {

        setNotification({
            type,
            message
        });


        setTimeout(() => {

            setNotification(null);

        }, 2000);

    };


    // =========================
    // LOAD PROFILE
    // =========================

    useEffect(() => {

        const fetchProfile =
            async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/users/profile",
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load profile"
                    );

                }


                const profileData = {

                    first_name:
                        data.user.first_name || "",

                    last_name:
                        data.user.last_name || "",

                    email:
                        data.user.email || "",

                    phone_number:
                        data.user.phone_number || "",

                    role:
                        data.user.role || "",

                    created_at:
                        data.user.created_at || ""
                };


                setProfile(
                    profileData
                );

                setOriginalProfile(
                    profileData
                );


            } catch (error) {

                showNotification(
                    "error",
                    error.message
                );


            } finally {

                setLoading(false);

            }

        };


        fetchProfile();

    }, [token]);


    // =========================
    // INPUT CHANGE
    // =========================

    const handleChange =
        (event) => {

        const {
            name,
            value
        } = event.target;


        setProfile(
            (previous) => ({
                ...previous,
                [name]: value
            })
        );

    };


    // =========================
    // EDIT
    // =========================

    const handleEdit = () => {

        setOriginalProfile({
            ...profile
        });

        setIsEditing(true);

    };


    const handleCancel = () => {

        if (originalProfile) {

            setProfile({
                ...originalProfile
            });

        }

        setIsEditing(false);

    };


    // =========================
    // UPDATE PROFILE
    // =========================

    const handleSubmit =
        async (event) => {

        event.preventDefault();

        setSaving(true);


        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/users/profile",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            first_name:
                                profile.first_name,

                            last_name:
                                profile.last_name,

                            phone_number:
                                profile.phone_number
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update profile"
                );

            }


            const updatedProfile = {

                first_name:
                    data.user.first_name || "",

                last_name:
                    data.user.last_name || "",

                email:
                    data.user.email || "",

                phone_number:
                    data.user.phone_number || "",

                role:
                    data.user.role || "",

                created_at:
                    data.user.created_at || ""
            };


            setProfile(
                updatedProfile
            );

            setOriginalProfile(
                updatedProfile
            );


            const storedUser =
                JSON.parse(
                    localStorage.getItem("user")
                ) || {};


            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...storedUser,

                    first_name:
                        data.user.first_name,

                    last_name:
                        data.user.last_name,

                    email:
                        data.user.email
                })
            );


            setIsEditing(false);


            showNotification(
                "success",
                "Profile updated successfully"
            );


        } catch (error) {

            showNotification(
                "error",
                error.message
            );


        } finally {

            setSaving(false);

        }

    };


    return (

        <>

            <SellerNavbar />


            <main className="seller-profile-page">

                <div className="seller-profile-container">

                    <div className="seller-profile-header">

                        <div>

                            <h1>
                                My Profile
                            </h1>

                            <p>
                                Manage your seller
                                account information.
                            </p>

                        </div>


                        {!isEditing && (

                            <button
                                type="button"
                                className="seller-profile-edit-button"
                                onClick={
                                    handleEdit
                                }
                            >
                                Edit Profile
                            </button>

                        )}

                    </div>


                    {loading ? (

                        <div className="seller-profile-card">

                            Loading profile...

                        </div>

                    ) : (

                        <>

                            <section className="seller-profile-card">

                                <h2>
                                    Account Information
                                </h2>


                                <div className="seller-profile-summary">

                                    <div>

                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {profile.email}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Account Type
                                        </span>

                                        <strong>
                                            {profile.role}
                                        </strong>

                                    </div>


                                    <div>

                                        <span>
                                            Member Since
                                        </span>

                                        <strong>

                                            {
                                                profile.created_at
                                                    ? new Date(
                                                        profile.created_at
                                                    ).toLocaleDateString()
                                                    : "-"
                                            }

                                        </strong>

                                    </div>

                                </div>

                            </section>


                            <section className="seller-profile-card">

                                <h2>
                                    Personal Details
                                </h2>


                                <form
                                    onSubmit={
                                        handleSubmit
                                    }
                                >

                                    <div className="seller-profile-grid">

                                        <div className="seller-profile-field">

                                            <label>
                                                First Name
                                            </label>

                                            <input
                                                type="text"
                                                name="first_name"
                                                value={
                                                    profile.first_name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    !isEditing
                                                }
                                                required
                                            />

                                        </div>


                                        <div className="seller-profile-field">

                                            <label>
                                                Last Name
                                            </label>

                                            <input
                                                type="text"
                                                name="last_name"
                                                value={
                                                    profile.last_name
                                                }
                                                onChange={
                                                    handleChange
                                                }
                                                disabled={
                                                    !isEditing
                                                }
                                                required
                                            />

                                        </div>

                                    </div>


                                    <div className="seller-profile-field">

                                        <label>
                                            Email Address
                                        </label>

                                        <input
                                            type="email"
                                            value={
                                                profile.email
                                            }
                                            disabled
                                        />

                                    </div>


                                    <div className="seller-profile-field">

                                        <label>
                                            Phone Number
                                        </label>

                                        <input
                                            type="text"
                                            name="phone_number"
                                            value={
                                                profile.phone_number
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                        />

                                    </div>


                                    {isEditing && (

                                        <div className="seller-profile-actions">

                                            <button
                                                type="button"
                                                className="seller-profile-cancel"
                                                onClick={
                                                    handleCancel
                                                }
                                                disabled={
                                                    saving
                                                }
                                            >
                                                Cancel
                                            </button>


                                            <button
                                                type="submit"
                                                className="seller-profile-save"
                                                disabled={
                                                    saving
                                                }
                                            >
                                                {
                                                    saving
                                                        ? "Saving..."
                                                        : "Save Changes"
                                                }
                                            </button>

                                        </div>

                                    )}

                                </form>

                            </section>

                        </>

                    )}

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
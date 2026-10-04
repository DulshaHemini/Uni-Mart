import {
    useEffect,
    useState
} from "react";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import Notification from "../../components/Notification.jsx";

import "../../styles/Profile/Profile.css";


export default function Profile() {

    const token =
        localStorage.getItem("token");


    // ================================
    // STATES
    // ================================

    const [isEditing, setIsEditing] =
        useState(false);

    const [profile, setProfile] =
        useState({

            first_name: "",
            last_name: "",
            email: "",
            phone_number: "",

            shipping_address: "",
            shipping_city: "",
            shipping_postal_code: "",

            billing_address: "",
            billing_city: "",
            billing_postal_code: "",

            role: "",
            created_at: ""

        });


    const [originalProfile, setOriginalProfile] =
        useState(null);


    const [loading, setLoading] =
        useState(true);


    const [saving, setSaving] =
        useState(false);


    const [notification, setNotification] =
        useState(null);


    const [passwordForm, setPasswordForm] =
        useState({

            current_password: "",
            new_password: "",
            confirm_password: ""

        });


    const [
        changingPassword,
        setChangingPassword
    ] = useState(false);



    // ================================
    // SHOW NOTIFICATION
    // ================================

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

        }, 2000);

    };



    // ================================
    // GET PROFILE
    // ================================

    useEffect(() => {

        const fetchProfile = async () => {

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


                    shipping_address:
                        data.user.shipping_address || "",

                    shipping_city:
                        data.user.shipping_city || "",

                    shipping_postal_code:
                        data.user.shipping_postal_code || "",


                    billing_address:
                        data.user.billing_address || "",

                    billing_city:
                        data.user.billing_city || "",

                    billing_postal_code:
                        data.user.billing_postal_code || "",


                    role:
                        data.user.role || "",

                    created_at:
                        data.user.created_at || ""

                };


                setProfile(profileData);

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



    // ================================
    // START EDIT
    // ================================

    const handleEdit = () => {

        setOriginalProfile({
            ...profile
        });

        setIsEditing(true);

    };



    // ================================
    // CANCEL EDIT
    // ================================

    const handleCancel = () => {

        if (originalProfile) {

            setProfile({
                ...originalProfile
            });

        }

        setIsEditing(false);

    };



    // ================================
    // PROFILE INPUT CHANGE
    // ================================

    const handleChange = (event) => {

        const {
            name,
            value
        } = event.target;


        setProfile(
            (previousProfile) => ({

                ...previousProfile,

                [name]: value

            })
        );

    };



    // ================================
    // UPDATE PROFILE
    // ================================

    const handleSubmit = async (
        event
    ) => {

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
                                profile.phone_number,


                            shipping_address:
                                profile.shipping_address,

                            shipping_city:
                                profile.shipping_city,

                            shipping_postal_code:
                                profile.shipping_postal_code,


                            billing_address:
                                profile.billing_address,

                            billing_city:
                                profile.billing_city,

                            billing_postal_code:
                                profile.billing_postal_code

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


                shipping_address:
                    data.user.shipping_address || "",

                shipping_city:
                    data.user.shipping_city || "",

                shipping_postal_code:
                    data.user.shipping_postal_code || "",


                billing_address:
                    data.user.billing_address || "",

                billing_city:
                    data.user.billing_city || "",

                billing_postal_code:
                    data.user.billing_postal_code || "",


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
                    localStorage.getItem(
                        "user"
                    )
                ) || {};


            const updatedStoredUser = {

                ...storedUser,

                first_name:
                    data.user.first_name,

                last_name:
                    data.user.last_name,

                email:
                    data.user.email

            };


            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedStoredUser
                )
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



    // ================================
    // PASSWORD INPUT CHANGE
    // ================================

    const handlePasswordChange =
        (event) => {

            const {
                name,
                value
            } = event.target;


            setPasswordForm(
                (previousForm) => ({

                    ...previousForm,

                    [name]: value

                })
            );

        };



    // ================================
    // CHANGE PASSWORD
    // ================================

    const handleChangePassword =
        async (event) => {

            event.preventDefault();


            if (
                passwordForm.new_password !==
                passwordForm.confirm_password
            ) {

                showNotification(
                    "error",
                    "New passwords do not match"
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
                    "Password changed successfully"
                );


            } catch (error) {

                showNotification(
                    "error",
                    error.message
                );


            } finally {

                setChangingPassword(
                    false
                );

            }

        };



    // ================================
    // LOADING
    // ================================

    if (loading) {

        return (

            <>

                <BuyerNavbar />


                <main className="profile-page">

                    <div className="profile-container">

                        <p>
                            Loading profile...
                        </p>

                    </div>

                </main>


                <Footer />

            </>

        );

    }



    // ================================
    // PAGE
    // ================================

    return (

        <>

            <BuyerNavbar />


            <main className="profile-page">

                <div className="profile-container">


                    {/* =========================
                        PAGE HEADER
                    ========================= */}

                    <div className="profile-page-header">


                        <div>

                            <h1>
                                My Profile
                            </h1>

                            <p>
                                Manage your personal
                                information and delivery
                                addresses.
                            </p>

                        </div>


                        <div className="profile-header-actions">


                            {!isEditing && (

                                <button
                                    type="button"
                                    className="profile-edit-button"
                                    onClick={
                                        handleEdit
                                    }
                                >

                                    Edit Profile

                                </button>

                            )}


                            <div className="profile-avatar-large">

                                👤

                            </div>


                        </div>


                    </div>



                    {/* =========================
                        PROFILE SECTIONS
                    ========================= */}

                    <div className="profile-sections">



                        {/* =========================
                            ACCOUNT INFORMATION
                        ========================= */}

                        <section className="profile-form-card">

                            <h2>
                                Account Information
                            </h2>


                            <div className="profile-account-grid">


                                <div className="profile-summary-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {profile.email}
                                    </strong>

                                </div>


                                <div className="profile-summary-item">

                                    <span>
                                        Account Type
                                    </span>

                                    <strong className="profile-role">
                                        {profile.role}
                                    </strong>

                                </div>


                                <div className="profile-summary-item">

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



                        {/* =========================
                            PERSONAL DETAILS
                        ========================= */}

                        <section className="profile-form-card">

                            <h2>
                                Personal Details
                            </h2>


                            <form
                                onSubmit={
                                    handleSubmit
                                }
                            >


                                {/* NAME */}

                                <div className="profile-form-row">


                                    <div className="profile-field">

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


                                    <div className="profile-field">

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



                                {/* EMAIL */}

                                <div className="profile-field">

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

                                    <small>
                                        Email cannot be changed here.
                                    </small>

                                </div>



                                {/* PHONE */}

                                <div className="profile-field">

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
                                        required
                                    />

                                </div>



                                {/* =========================
                                    SHIPPING
                                ========================= */}

                                <div className="profile-field">

                                    <label>
                                        Shipping Address
                                    </label>

                                    <textarea
                                        name="shipping_address"
                                        value={
                                            profile.shipping_address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            !isEditing
                                        }
                                        rows="3"
                                        placeholder="Enter your shipping address"
                                    />

                                </div>


                                <div className="profile-form-row">


                                    <div className="profile-field">

                                        <label>
                                            Shipping City
                                        </label>

                                        <input
                                            type="text"
                                            name="shipping_city"
                                            value={
                                                profile.shipping_city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            placeholder="Enter city"
                                        />

                                    </div>


                                    <div className="profile-field">

                                        <label>
                                            Shipping Postal Code
                                        </label>

                                        <input
                                            type="text"
                                            name="shipping_postal_code"
                                            value={
                                                profile.shipping_postal_code
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            placeholder="Enter postal code"
                                        />

                                    </div>


                                </div>



                                {/* =========================
                                    BILLING
                                ========================= */}

                                <div className="profile-field">

                                    <label>
                                        Billing Address
                                    </label>

                                    <textarea
                                        name="billing_address"
                                        value={
                                            profile.billing_address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={
                                            !isEditing
                                        }
                                        rows="3"
                                        placeholder="Enter your billing address"
                                    />

                                </div>


                                <div className="profile-form-row">


                                    <div className="profile-field">

                                        <label>
                                            Billing City
                                        </label>

                                        <input
                                            type="text"
                                            name="billing_city"
                                            value={
                                                profile.billing_city
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            placeholder="Enter city"
                                        />

                                    </div>


                                    <div className="profile-field">

                                        <label>
                                            Billing Postal Code
                                        </label>

                                        <input
                                            type="text"
                                            name="billing_postal_code"
                                            value={
                                                profile.billing_postal_code
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            disabled={
                                                !isEditing
                                            }
                                            placeholder="Enter postal code"
                                        />

                                    </div>


                                </div>



                                {/* ACTIONS */}

                                {isEditing && (

                                    <div className="profile-form-actions">


                                        <button
                                            type="button"
                                            className="profile-cancel-button"
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
                                            className="profile-save-button"
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



                        {/* =========================
                            CHANGE PASSWORD
                        ========================= */}

                        <section className="profile-form-card">

                            <h2>
                                Change Password
                            </h2>


                            <form
                                onSubmit={
                                    handleChangePassword
                                }
                            >


                                <div className="profile-field">

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
                                        required
                                    />

                                </div>


                                <div className="profile-field">

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
                                        minLength="8"
                                        required
                                    />

                                </div>


                                <div className="profile-field">

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
                                        minLength="8"
                                        required
                                    />

                                </div>


                                <div className="profile-form-actions">

                                    <button
                                        type="submit"
                                        className="profile-save-button"
                                        disabled={
                                            changingPassword
                                        }
                                    >

                                        {
                                            changingPassword

                                                ? "Changing..."

                                                : "Change Password"
                                        }

                                    </button>

                                </div>


                            </form>

                        </section>


                    </div>


                </div>

            </main>


            <Footer />


            {/* =========================
                NOTIFICATION
            ========================= */}

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
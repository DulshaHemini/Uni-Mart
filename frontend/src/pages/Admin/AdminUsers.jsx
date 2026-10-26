import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Admin/AdminUsers.css";

export default function AdminUsers() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const searchRef = useRef(search);
    const [roleFilter, setRoleFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [userToBlock, setUserToBlock] =
    useState(null);


    const fetchUsers = async () => {

        try {

            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (roleFilter) {
                params.append("role", roleFilter);
            }

            const response = await fetch(
                `http://localhost:5000/api/admin/users?${params.toString()}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load users."
                );
            }

            setUsers(data.users || []);

        } catch (error) {

            console.error(error);
            setError(error.message);

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {
        searchRef.current = search;
    }, [search]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams();
                const currentSearch = searchRef.current.trim();

                if (currentSearch) {
                    params.append("search", currentSearch);
                }

                if (roleFilter) {
                    params.append("role", roleFilter);
                }

                const response = await fetch(
                    `http://localhost:5000/api/admin/users?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load users."
                    );
                }

                setUsers(data.users || []);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, [roleFilter, token]);


    const handleSearch = (e) => {

        e.preventDefault();

        fetchUsers();

    };


    const handleBlockToggle = async (user) => {

    try {

        const newStatus =
            !user.is_block;


        const response = await fetch(
            `http://localhost:5000/api/admin/users/${user._id}/block`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",

                    Authorization:
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    is_block: newStatus
                })
            }
        );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Failed to update user."
            );

        }


        setUserToBlock(null);

        fetchUsers();


    } catch (error) {

        alert(error.message);

    }

};

    return (

    <div className="admin-users-page">

        {userToBlock && (

            <div className="user-confirm-overlay">

                <div className="user-confirm-box">

                    <div className="user-confirm-icon">
                        !
                    </div>

                    <h3>
                        {
                            userToBlock.is_block
                                ? "Unblock User?"
                                : "Block User?"
                        }
                    </h3>

                    <p>
                        {
                            userToBlock.is_block
                                ? `Are you sure you want to unblock ${userToBlock.first_name} ${userToBlock.last_name}?`
                                : `Are you sure you want to block ${userToBlock.first_name} ${userToBlock.last_name}?`
                        }
                    </p>

                    <div className="user-confirm-actions">

                        <button
                            className="user-confirm-cancel"
                            onClick={() =>
                                setUserToBlock(null)
                            }
                        >
                            Cancel
                        </button>

                        <button
                            className={
                                userToBlock.is_block
                                    ? "user-confirm-unblock"
                                    : "user-confirm-block"
                            }
                            onClick={() =>
                                handleBlockToggle(userToBlock)
                            }
                        >
                            {
                                userToBlock.is_block
                                    ? "Unblock"
                                    : "Block"
                            }
                        </button>

                    </div>

                </div>

            </div>

        )}


        {/* HEADER */}

        <div className="admin-users-header">

                <div>

                    <h1>
                        User Management
                    </h1>

                    <p>
                        View and manage UniMart users.
                    </p>

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/admin/dashboard"
                        )
                    }
                >
                    Back to Dashboard
                </button>

            </div>


            {/* TOOLBAR */}

            <div className="admin-users-toolbar">

                <form
                    className="admin-users-search"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search name or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <button type="submit">
                        Search
                    </button>

                </form>


                <select
                    value={roleFilter}
                    onChange={(e) =>
                        setRoleFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Roles
                    </option>

                    <option value="buyer">
                        Buyer
                    </option>

                    <option value="seller">
                        Seller
                    </option>

                    <option value="admin">
                        Admin
                    </option>

                </select>

            </div>


            {loading && (

                <div className="admin-users-state">
                    Loading users...
                </div>

            )}


            {error && (

                <div className="admin-users-error">
                    {error}
                </div>

            )}


            {!loading && !error && (

                <div className="admin-users-card">

                    <div className="admin-users-table-wrapper">

                        <table className="admin-users-table">

                            <thead>

                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Joined</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {users.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="7"
                                            className="admin-users-empty"
                                        >
                                            No users found.
                                        </td>

                                    </tr>

                                ) : (

                                    users.map(
                                        (user) => (

                                            <tr key={user._id}>

                                                <td>

                                                    <div className="admin-user-name">

                                                        <div className="admin-user-avatar">

                                                            {
                                                                user.first_name
                                                                    ?.charAt(0)
                                                                    ?.toUpperCase() ||
                                                                "U"
                                                            }

                                                        </div>


                                                        <span>
                                                            {
                                                                `${user.first_name} ${user.last_name}`
                                                            }
                                                        </span>

                                                    </div>

                                                </td>


                                                <td>
                                                    {user.email}
                                                </td>


                                                <td>
                                                    {
                                                        user.phone_number ||
                                                        "-"
                                                    }
                                                </td>


                                                <td>

                                                    <span
                                                        className={`admin-user-role role-${user.role}`}
                                                    >
                                                        {user.role}
                                                    </span>

                                                </td>


                                                <td>

                                                    <span
                                                        className={`admin-user-status ${
                                                            user.is_block
                                                                ? "user-blocked"
                                                                : "user-active"
                                                        }`}
                                                    >
                                                        {
                                                            user.is_block
                                                                ? "Blocked"
                                                                : "Active"
                                                        }
                                                    </span>

                                                </td>


                                                <td>

                                                    {
                                                        user.created_at
                                                            ? new Date(
                                                                user.created_at
                                                            ).toLocaleDateString()
                                                            : "-"
                                                    }

                                                </td>


                                                <td>

                                                    <button
                                                        className={
                                                            user.is_block
                                                                ? "admin-unblock-button"
                                                                : "admin-block-button"
                                                        }
                                                        onClick={() =>
                                                            setUserToBlock(
                                                                user
                                                            )
                                                        }
                                                    >

                                                        {
                                                            user.is_block
                                                                ? "Unblock"
                                                                : "Block"
                                                        }

                                                    </button>

                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    );

}
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    allowedRoles
}) {

    const token = localStorage.getItem("token");

    let user;

    try {
        user = JSON.parse(localStorage.getItem("user"));
    } catch {
        user = null;
    }


    // ================================
    // Not logged in
    // ================================

    if (!token || !user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // ================================
    // Role not allowed
    // ================================

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }


    // ================================
    // Access allowed
    // ================================

    return children;
}
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Admin/AdminProducts.css";


export default function AdminProducts() {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const searchRef = useRef(search);
    const [statusFilter, setStatusFilter] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const fetchProducts = async () => {

        try {

            setLoading(true);
            setError("");

            const params = new URLSearchParams();

            if (search.trim()) {
                params.append("search", search.trim());
            }

            if (statusFilter) {
                params.append("status", statusFilter);
            }


            const response = await fetch(
                `http://localhost:5000/api/admin/products?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load products."
                );

            }


            setProducts(data.products || []);

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
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const params = new URLSearchParams();
                const currentSearch = searchRef.current.trim();

                if (currentSearch) {
                    params.append("search", currentSearch);
                }

                if (statusFilter) {
                    params.append("status", statusFilter);
                }

                const response = await fetch(
                    `http://localhost:5000/api/admin/products?${params.toString()}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load products."
                    );
                }

                setProducts(data.products || []);
            } catch (error) {
                console.error(error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, [statusFilter, token]);


    const handleSearch = (e) => {

        e.preventDefault();

        fetchProducts();

    };


    const handleStatusChange = async (
        productId,
        currentStatus
    ) => {

        const newStatus =
            currentStatus === "active"
                ? "inactive"
                : "active";


        const confirmed = window.confirm(
            `Are you sure you want to ${newStatus} this product?`
        );


        if (!confirmed) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/admin/products/${productId}/status`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        status: newStatus
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update product status."
                );

            }


            fetchProducts();

        } catch (error) {

            alert(error.message);

        }

    };


    return (

        <div className="admin-products-page">

            <div className="admin-products-header">

                <div>

                    <h1>
                        Product Management
                    </h1>

                    <p>
                        View and manage UniMart products.
                    </p>

                </div>


                <button
                    className="admin-products-back"
                    onClick={() =>
                        navigate("/admin/dashboard")
                    }
                >
                    Back to Dashboard
                </button>

            </div>


            <div className="admin-products-toolbar">

                <form
                    className="admin-products-search"
                    onSubmit={handleSearch}
                >

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button type="submit">
                        Search
                    </button>

                </form>


                <select
                    value={statusFilter}
                    onChange={(e) =>
                        setStatusFilter(e.target.value)
                    }
                >

                    <option value="">
                        All Status
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>

                </select>

            </div>


            {loading && (
                <div className="admin-products-state">
                    Loading products...
                </div>
            )}


            {error && (
                <div className="admin-products-error">
                    {error}
                </div>
            )}


            {!loading && !error && (

                <div className="admin-products-card">

                    <div className="admin-products-table-wrapper">

                        <table className="admin-products-table">

                            <thead>

                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Seller</th>
                                    <th>Price</th>
                                    <th>Stock</th>
                                    <th>Condition</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>


                            <tbody>

                                {products.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="8"
                                            className="admin-products-empty"
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    products.map(
                                        (product) => (

                                            <tr key={product._id}>

                                                <td>

                                                    <div className="admin-product-name-cell">

                                                        {product.image && (

                                                            <img
                                                                src={product.image}
                                                                alt={product.product_name}
                                                            />

                                                        )}


                                                        <span>
                                                            {product.product_name}
                                                        </span>

                                                    </div>

                                                </td>


                                                <td>
                                                    {
                                                        product.category_id
                                                            ?.category_name ||
                                                        "No Category"
                                                    }
                                                </td>


                                                <td>

                                                    {
                                                        product.seller_id
                                                            ? `${product.seller_id.first_name} ${product.seller_id.last_name}`
                                                            : "Unknown"
                                                    }

                                                </td>


                                                <td>
                                                    Rs.{" "}
                                                    {Number(
                                                        product.price
                                                    ).toLocaleString()}
                                                </td>


                                                <td>

                                                    <span
                                                        className={
                                                            product.stock_quantity <= 5
                                                                ? "admin-stock-low"
                                                                : ""
                                                        }
                                                    >
                                                        {product.stock_quantity}
                                                    </span>

                                                </td>


                                                <td className="admin-condition">

                                                    {product.condition}

                                                </td>


                                                <td>

                                                    <span
                                                        className={`admin-product-status ${
                                                            product.status === "active"
                                                                ? "product-active"
                                                                : "product-inactive"
                                                        }`}
                                                    >

                                                        {product.status}

                                                    </span>

                                                </td>


                                                <td>

                                                    <div className="admin-product-actions">

                                                        <button
                                                            className="admin-edit-button"
                                                            onClick={() =>
                                                                navigate(
                                                                    `/admin/products/${product._id}/edit`
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>


                                                        <button
                                                            className={
                                                                product.status === "active"
                                                                    ? "admin-deactivate-button"
                                                                    : "admin-activate-button"
                                                            }
                                                            onClick={() =>
                                                                handleStatusChange(
                                                                    product._id,
                                                                    product.status
                                                                )
                                                            }
                                                        >

                                                            {
                                                                product.status === "active"
                                                                    ? "Deactivate"
                                                                    : "Activate"
                                                            }

                                                        </button>

                                                    </div>

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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../../styles/Admin/AdminInventory.css";


export default function AdminInventory() {

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [stockValue, setStockValue] = useState("");
    const [saving, setSaving] = useState(false);


    // ================================
    // LOAD INVENTORY
    // ================================

    const fetchInventory = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/admin/inventory",
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
                    "Failed to load inventory."
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

        fetchInventory();

    }, []);


    // ================================
    // START EDITING
    // ================================

    const handleEdit = (product) => {

        setEditingId(product._id);

        setStockValue(
            product.stock_quantity
        );

    };


    // ================================
    // CANCEL EDITING
    // ================================

    const handleCancel = () => {

        setEditingId(null);
        setStockValue("");

    };


    // ================================
    // UPDATE STOCK
    // ================================

    const handleSaveStock = async (
        productId
    ) => {

        if (
            stockValue === "" ||
            Number(stockValue) < 0
        ) {

            alert(
                "Please enter a valid stock quantity."
            );

            return;

        }


        try {

            setSaving(true);

            const response = await fetch(
                `http://localhost:5000/api/admin/inventory/${productId}/stock`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        stock_quantity:
                            Number(stockValue)
                    })
                }
            );

            const data = await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update stock."
                );

            }


            setEditingId(null);
            setStockValue("");

            fetchInventory();

        } catch (error) {

            alert(error.message);

        } finally {

            setSaving(false);

        }

    };


    // ================================
    // STOCK STATUS
    // ================================

    const getStockStatus = (quantity) => {

        if (quantity === 0) {

            return {
                label: "Out of Stock",
                className: "inventory-out"
            };

        }

        if (quantity <= 5) {

            return {
                label: "Low Stock",
                className: "inventory-low"
            };

        }

        return {
            label: "In Stock",
            className: "inventory-good"
        };

    };


    return (

        <div className="admin-inventory-page">


            {/* HEADER */}

            <div className="admin-inventory-header">

                <div>

                    <h1>
                        Inventory Management
                    </h1>

                    <p>
                        Monitor and update UniMart
                        product stock levels.
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


            {loading && (

                <div className="inventory-state">
                    Loading inventory...
                </div>

            )}


            {error && (

                <div className="inventory-error">
                    {error}
                </div>

            )}


            {!loading && !error && (

                <div className="inventory-card">

                    <div className="inventory-table-wrapper">

                        <table className="inventory-table">

                            <thead>

                                <tr>
                                    <th>Product</th>
                                    <th>Category</th>
                                    <th>Current Stock</th>
                                    <th>Stock Status</th>
                                    <th>Product Status</th>
                                    <th>Action</th>
                                </tr>

                            </thead>


                            <tbody>

                                {products.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="inventory-empty"
                                        >
                                            No products found.
                                        </td>

                                    </tr>

                                ) : (

                                    products.map(
                                        (product) => {

                                            const stockStatus =
                                                getStockStatus(
                                                    product.stock_quantity
                                                );

                                            return (

                                                <tr
                                                    key={product._id}
                                                >

                                                    <td className="inventory-product-name">
                                                        {
                                                            product.product_name
                                                        }
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
                                                            editingId ===
                                                            product._id
                                                                ? (

                                                                    <input
                                                                        className="inventory-stock-input"
                                                                        type="number"
                                                                        min="0"
                                                                        value={
                                                                            stockValue
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setStockValue(
                                                                                e.target.value
                                                                            )
                                                                        }
                                                                    />

                                                                )
                                                                : product.stock_quantity
                                                        }

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`inventory-stock-badge ${stockStatus.className}`}
                                                        >
                                                            {
                                                                stockStatus.label
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        <span
                                                            className={`inventory-product-status ${
                                                                product.status ===
                                                                "active"
                                                                    ? "inventory-active"
                                                                    : "inventory-inactive"
                                                            }`}
                                                        >
                                                            {
                                                                product.status
                                                            }
                                                        </span>

                                                    </td>


                                                    <td>

                                                        {
                                                            editingId ===
                                                            product._id
                                                                ? (

                                                                    <div className="inventory-actions">

                                                                        <button
                                                                            className="inventory-save"
                                                                            disabled={
                                                                                saving
                                                                            }
                                                                            onClick={() =>
                                                                                handleSaveStock(
                                                                                    product._id
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                saving
                                                                                    ? "Saving..."
                                                                                    : "Save"
                                                                            }
                                                                        </button>


                                                                        <button
                                                                            className="inventory-cancel"
                                                                            onClick={
                                                                                handleCancel
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </button>

                                                                    </div>

                                                                )
                                                                : (

                                                                    <button
                                                                        className="inventory-edit"
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                product
                                                                            )
                                                                        }
                                                                    >
                                                                        Update Stock
                                                                    </button>

                                                                )
                                                        }

                                                    </td>

                                                </tr>

                                            );

                                        }
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
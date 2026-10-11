import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../styles/Admin/AdminEditProduct.css";


export default function AdminEditProduct() {

    const { id } = useParams();
    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    const [formData, setFormData] = useState({
        product_name: "",
        description: "",
        category_id: "",
        price: "",
        condition: "new",
        stock_quantity: "",
        image: "",
        status: "active"
    });

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ================================
    // LOAD PRODUCT + CATEGORIES
    // ================================

    useEffect(() => {

        const loadData = async () => {

            try {

                setLoading(true);
                setError("");


                const productResponse = await fetch(
                    `http://localhost:5000/api/admin/products/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );


                const productData =
                    await productResponse.json();


                if (!productResponse.ok) {

                    throw new Error(
                        productData.message ||
                        "Failed to load product."
                    );

                }


                const product =
                    productData.product;


                setFormData({

                    product_name:
                        product.product_name || "",

                    description:
                        product.description || "",

                    category_id:
                        product.category_id?._id || "",

                    price:
                        product.price ?? "",

                    condition:
                        product.condition || "new",

                    stock_quantity:
                        product.stock_quantity ?? "",

                    image:
                        product.image || "",

                    status:
                        product.status || "active"

                });


                // Get Categories

                const categoryResponse =
                    await fetch(
                        "http://localhost:5000/api/categories"
                    );


                const categoryData =
                    await categoryResponse.json();


                if (categoryResponse.ok) {

                    setCategories(
                        categoryData.categories || []
                    );

                }


            } catch (error) {

                console.error(error);

                setError(error.message);

            } finally {

                setLoading(false);

            }

        };


        loadData();

    }, [id, token]);


    // ================================
    // HANDLE INPUT
    // ================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    };


    // ================================
    // SAVE PRODUCT
    // ================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");


        if (!formData.product_name.trim()) {

            setError(
                "Product name is required."
            );

            return;

        }


        if (
            !formData.category_id
        ) {

            setError(
                "Please select a category."
            );

            return;

        }


        if (
            formData.price === "" ||
            Number(formData.price) < 0
        ) {

            setError(
                "Please enter a valid price."
            );

            return;

        }


        if (
            formData.stock_quantity === "" ||
            Number(formData.stock_quantity) < 0
        ) {

            setError(
                "Please enter a valid stock quantity."
            );

            return;

        }


        try {

            setSaving(true);


            const response = await fetch(
                `http://localhost:5000/api/admin/products/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        ...formData,
                        price:
                            Number(formData.price),
                        stock_quantity:
                            Number(
                                formData.stock_quantity
                            )
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update product."
                );

            }


            setSuccess(
                "Product updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/admin/products"
                );

            }, 1200);


        } catch (error) {

            console.error(error);

            setError(error.message);

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="admin-edit-state">
                Loading product...
            </div>
        );

    }


    return (

        <div className="admin-edit-page">

            <div className="admin-edit-header">

                <div>

                    <h1>
                        Edit Product
                    </h1>

                    <p>
                        Update product details,
                        stock and status.
                    </p>

                </div>


                <button
                    type="button"
                    className="admin-edit-back"
                    onClick={() =>
                        navigate(
                            "/admin/products"
                        )
                    }
                >
                    Back to Products
                </button>

            </div>


            <form
                className="admin-edit-card"
                onSubmit={handleSubmit}
            >


                {error && (

                    <div className="admin-edit-error">
                        {error}
                    </div>

                )}


                {success && (

                    <div className="admin-edit-success">
                        {success}
                    </div>

                )}


                <div className="admin-edit-grid">


                    <div className="admin-edit-group">

                        <label>
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="product_name"
                            value={
                                formData.product_name
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="admin-edit-group">

                        <label>
                            Category
                        </label>

                        <select
                            name="category_id"
                            value={
                                formData.category_id
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="">
                                Select Category
                            </option>

                            {categories.map(
                                (category) => (

                                    <option
                                        key={
                                            category._id
                                        }
                                        value={
                                            category._id
                                        }
                                    >
                                        {
                                            category.category_name
                                        }
                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    <div className="admin-edit-group">

                        <label>
                            Price (Rs.)
                        </label>

                        <input
                            type="number"
                            min="0"
                            name="price"
                            value={
                                formData.price
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="admin-edit-group">

                        <label>
                            Stock Quantity
                        </label>

                        <input
                            type="number"
                            min="0"
                            name="stock_quantity"
                            value={
                                formData.stock_quantity
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>


                    <div className="admin-edit-group">

                        <label>
                            Condition
                        </label>

                        <select
                            name="condition"
                            value={
                                formData.condition
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="new">
                                New
                            </option>

                            <option value="used">
                                Used
                            </option>

                        </select>

                    </div>


                    <div className="admin-edit-group">

                        <label>
                            Status
                        </label>

                        <select
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={
                                handleChange
                            }
                        >

                            <option value="active">
                                Active
                            </option>

                            <option value="inactive">
                                Inactive
                            </option>

                        </select>

                    </div>


                    <div className="admin-edit-group admin-edit-full">

                        <label>
                            Image URL
                        </label>

                        <input
                            type="text"
                            name="image"
                            value={
                                formData.image
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Product image URL"
                        />

                    </div>


                    <div className="admin-edit-group admin-edit-full">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            rows="6"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                        />

                    </div>

                </div>


                <div className="admin-edit-actions">

                    <button
                        type="button"
                        className="admin-edit-cancel"
                        onClick={() =>
                            navigate(
                                "/admin/products"
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        className="admin-edit-save"
                        disabled={saving}
                    >
                        {
                            saving
                                ? "Saving..."
                                : "Save Changes"
                        }
                    </button>

                </div>

            </form>

        </div>

    );

}
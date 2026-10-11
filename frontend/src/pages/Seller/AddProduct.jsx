import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SellerNavbar from "../../components/Seller/SellerNavbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/Seller/ProductForm.css";

export default function AddProduct() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [condition, setCondition] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [image, setImage] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const sellerId =
        user?.user_id ||
        user?._id ||
        user?.id;


    useEffect(() => {

        async function fetchCategories() {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/categories"
                );

                const data = await response.json();

                setCategories(
                    data.categories || []
                );

            } catch (error) {

                console.log(error);

            }

        }

        fetchCategories();

    }, []);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        if (!sellerId) {
            setError(
                "Seller information not found. Please login again."
            );

            return;
        }


        try {

            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        seller_id: sellerId,
                        category_id: categoryId,
                        product_name: productName,
                        description,
                        price: Number(price),
                        condition,
                        stock_quantity:
                            Number(stockQuantity),
                        image
                    })
                }
            );


            const data = await response.json();


            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to add product."
                );
            }


            setMessage(
                "Product added successfully."
            );


            setProductName("");
            setDescription("");
            setCategoryId("");
            setPrice("");
            setCondition("");
            setStockQuantity("");
            setImage("");


            setTimeout(() => {

                navigate(
                    "/seller/dashboard"
                );

            }, 1000);


        } catch (error) {

            console.log(error);

            setError(
                "Failed to add product."
            );

        }

    };


    return (
        <>

            <SellerNavbar />


            <main className="add-product-page">

                <div className="add-product-container">

                    <h1>
                        Add New Product
                    </h1>


                    <p className="add-product-subtitle">
                        Add a new product to UniMart.
                    </p>


                    {message && (
                        <p className="add-product-success">
                            {message}
                        </p>
                    )}


                    {error && (
                        <p className="add-product-error">
                            {error}
                        </p>
                    )}


                    <form
                        className="add-product-form"
                        onSubmit={handleSubmit}
                    >

                        <div className="form-group">

                            <label>
                                Product Name
                            </label>

                            <input
                                type="text"
                                value={productName}
                                onChange={(event) =>
                                    setProductName(
                                        event.target.value
                                    )
                                }
                                placeholder="Enter product name"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Description
                            </label>

                            <textarea
                                value={description}
                                onChange={(event) =>
                                    setDescription(
                                        event.target.value
                                    )
                                }
                                placeholder="Describe your product"
                                required
                            />

                        </div>


                        <div className="add-product-row">

                            <div className="form-group">

                                <label>
                                    Category
                                </label>

                                <select
                                    value={categoryId}
                                    onChange={(event) =>
                                        setCategoryId(
                                            event.target.value
                                        )
                                    }
                                    required
                                >

                                    <option value="">
                                        Select Category
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={category._id}
                                                value={category._id}
                                            >
                                                {
                                                    category.category_name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={price}
                                    onChange={(event) =>
                                        setPrice(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Rs."
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    value={stockQuantity}
                                    onChange={(event) =>
                                        setStockQuantity(
                                            event.target.value
                                        )
                                    }
                                    placeholder="0"
                                    required
                                />

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Condition
                            </label>

                            <div className="condition-options">

                                <label>

                                    <input
                                        type="radio"
                                        name="condition"
                                        value="new"
                                        checked={
                                            condition === "new"
                                        }
                                        onChange={(event) =>
                                            setCondition(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                    New

                                </label>


                                <label>

                                    <input
                                        type="radio"
                                        name="condition"
                                        value="used"
                                        checked={
                                            condition === "used"
                                        }
                                        onChange={(event) =>
                                            setCondition(
                                                event.target.value
                                            )
                                        }
                                    />

                                    Used

                                </label>

                            </div>

                        </div>


                        <div className="form-group">

                            <label>
                                Product Image URL
                            </label>

                            <input
                                type="text"
                                value={image}
                                onChange={(event) =>
                                    setImage(
                                        event.target.value
                                    )
                                }
                                placeholder="Optional"
                            />

                        </div>


                        <div className="add-product-actions">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    navigate(
                                        "/seller/dashboard"
                                    )
                                }
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="add-product-submit"
                            >
                                Add Product
                            </button>

                        </div>

                    </form>

                </div>

            </main>


            <Footer />

        </>
    );
}
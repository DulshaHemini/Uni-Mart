import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SellerNavbar from "../../components/Seller/SellerNavbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/Seller/ProductForm.css";

export default function EditProduct() {

    const { id } = useParams();

    const navigate = useNavigate();


    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [price, setPrice] = useState("");
    const [condition, setCondition] = useState("");
    const [stockQuantity, setStockQuantity] = useState("");
    const [image, setImage] = useState("");

    const [categories, setCategories] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");


    useEffect(() => {

        async function fetchData() {

            try {

                const productResponse = await fetch(
                    `http://localhost:5000/api/products/${id}`
                );

                const productData =
                    await productResponse.json();


                if (!productResponse.ok) {
                    throw new Error(
                        productData.message ||
                        "Failed to load product."
                    );
                }


                const product = productData.product;


                setProductName(
                    product.product_name || ""
                );

                setDescription(
                    product.description || ""
                );

                setCategoryId(
                    product.category_id?._id || ""
                );

                setPrice(
                    product.price || ""
                );

                setCondition(
                    product.condition || ""
                );

                setStockQuantity(
                    product.stock_quantity || ""
                );

                setImage(
                    product.image || ""
                );


                const categoryResponse = await fetch(
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

                console.log(error);

                setError(
                    "Failed to load product."
                );

            } finally {

                setLoading(false);

            }

        }


        fetchData();

    }, [id]);


    const handleSubmit = async (event) => {

        event.preventDefault();

        setMessage("");
        setError("");


        try {

            const response = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        product_name: productName,
                        description,
                        category_id: categoryId,
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
                    "Failed to update product."
                );
            }


            setMessage(
                "Product updated successfully."
            );


            setTimeout(() => {

                navigate(
                    "/seller/dashboard"
                );

            }, 1000);


        } catch (error) {

            console.log(error);

            setError(
                "Failed to update product."
            );

        }

    };


    if (loading) {

        return (
            <>
                <SellerNavbar />

                <div
                    style={{
                        padding: "40px"
                    }}
                >
                    Loading product...
                </div>
            </>
        );

    }


    return (
        <>

            <SellerNavbar />


            <main className="add-product-page">

                <div className="add-product-container">

                    <h1>
                        Edit Product
                    </h1>


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
                                        required
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
                                Update Product
                            </button>

                        </div>

                    </form>

                </div>

            </main>


            <Footer />

        </>
    );
}
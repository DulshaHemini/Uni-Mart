import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    useEffect,
    useState
} from "react";

import Navbar from "../Navbar.jsx";
import BuyerNavbar from "../Buyer/BuyerNavbar.jsx";
import Footer from "../Footer.jsx";
import Notification from "../Notification.jsx";

import "../../styles/Products/ProductDetails.css";


export default function ProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [addingToCart, setAddingToCart] =
        useState(false);

    const [notification, setNotification] =
        useState(null);


    // =========================
    // CURRENT USER
    // =========================

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const token =
        localStorage.getItem("token");

    const isBuyer =
        user?.role === "buyer";


    // =========================
    // GET PRODUCT BY ID
    // =========================

    useEffect(() => {

        const fetchProduct = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    `http://localhost:5000/api/products/${id}`
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Product not found"
                    );

                }

                setProduct(
                    data.product
                );

            } catch (error) {

                console.error(
                    "Product fetch error:",
                    error
                );

                setError(
                    "Unable to load product."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchProduct();

    }, [id]);


    // =========================
    // AUTO HIDE NOTIFICATION
    // =========================

    useEffect(() => {

        if (!notification) {
            return;
        }

        const timer = setTimeout(() => {

            setNotification(null);

        }, 2000);


        return () =>
            clearTimeout(timer);

    }, [notification]);


    // =========================
    // QUANTITY
    // =========================

    const increaseQuantity = () => {

        if (
            product &&
            quantity <
                product.stock_quantity
        ) {

            setQuantity(
                quantity + 1
            );

        }

    };


    const decreaseQuantity = () => {

        if (quantity > 1) {

            setQuantity(
                quantity - 1
            );

        }

    };


    // =========================
    // ADD TO CART
    // =========================

    const handleAddToCart = async () => {

        // Public user must login first
        if (!token || !user) {

            navigate("/login");

            return;
        }


        // Only buyers can use the cart
        if (!isBuyer) {

            setNotification({
                type: "error",
                message:
                    "Only buyers can add products to the cart."
            });

            return;
        }


        if (!product) {
            return;
        }


        try {

            setAddingToCart(true);


            const response = await fetch(
                "http://localhost:5000/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        product_id:
                            product._id,

                        quantity:
                            quantity
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add product to cart."
                );

            }


            setNotification({
                type: "success",
                message:
                    "Product added to cart successfully."
            });


            // Reset quantity after adding
            setQuantity(1);


            // Tell navbar/cart listeners
            window.dispatchEvent(
                new Event(
                    "cartUpdated"
                )
            );

        } catch (error) {

            console.error(
                "Add to cart error:",
                error
            );


            setNotification({
                type: "error",
                message:
                    error.message ||
                    "Failed to add product to cart."
            });

        } finally {

            setAddingToCart(false);

        }

    };


    return (
        <>

            {isBuyer ? (
                <BuyerNavbar />
            ) : (
                <Navbar />
            )}


            <main className="product-details-page">

                <div className="product-details-container">


                    <Link
                        to="/products"
                        className="back-to-products"
                    >
                        ← Back to Products
                    </Link>


                    {/* LOADING */}

                    {loading && (

                        <div className="product-not-found">

                            <h2>
                                Loading product...
                            </h2>

                        </div>

                    )}


                    {/* ERROR */}

                    {!loading && error && (

                        <div className="product-not-found">

                            <h2>
                                Product not found
                            </h2>

                            <p>
                                {error}
                            </p>

                        </div>

                    )}


                    {/* PRODUCT */}

                    {!loading &&
                        !error &&
                        product && (

                        <>

                            <div className="product-details-content">


                                {/* IMAGE */}

                                <div className="product-details-image">

                                    {product.image ? (

                                        <img
                                            src={product.image}
                                            alt={
                                                product.product_name
                                            }
                                        />

                                    ) : (

                                        <span>
                                            Product Image
                                        </span>

                                    )}

                                </div>


                                {/* INFORMATION */}

                                <div className="product-details-info">


                                    <span className="product-category">

                                        {
                                            product.category_id
                                                ?.category_name ||
                                            "Uncategorized"
                                        }

                                    </span>


                                    <h1>
                                        {
                                            product.product_name
                                        }
                                    </h1>


                                    <p className="product-details-price">

                                        Rs.{" "}

                                        {Number(
                                            product.price
                                        ).toLocaleString()}

                                    </p>


                                    <div className="product-basic-info">

                                        <p>

                                            <strong>
                                                Condition:
                                            </strong>{" "}

                                            {product.condition
                                                ? product.condition
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  product.condition.slice(
                                                      1
                                                  )
                                                : ""
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                Seller:
                                            </strong>{" "}

                                            {product.seller_id
                                                ? `${product.seller_id.first_name} ${product.seller_id.last_name}`
                                                : "Unknown Seller"
                                            }

                                        </p>


                                        <p>

                                            <strong>
                                                In Stock:
                                            </strong>{" "}

                                            {
                                                product.stock_quantity
                                            }

                                        </p>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div className="product-description">

                                        <h2>
                                            Product Description
                                        </h2>

                                        <p>
                                            {
                                                product.description
                                            }
                                        </p>

                                    </div>


                                    {/* QUANTITY */}

                                    <div className="product-quantity-section">

                                        <h2>
                                            Quantity
                                        </h2>


                                        <div className="quantity-control">

                                            <button
                                                type="button"
                                                onClick={
                                                    decreaseQuantity
                                                }
                                                disabled={
                                                    quantity <= 1
                                                }
                                            >
                                                −
                                            </button>


                                            <span>
                                                {quantity}
                                            </span>


                                            <button
                                                type="button"
                                                onClick={
                                                    increaseQuantity
                                                }
                                                disabled={
                                                    quantity >=
                                                    product.stock_quantity
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>


                                    {/* ACTIONS */}

                                    <div className="product-actions">

                                        <button
                                            type="button"
                                            className="add-to-cart-button"
                                            onClick={
                                                handleAddToCart
                                            }
                                            disabled={
                                                product.stock_quantity === 0 ||
                                                addingToCart
                                            }
                                        >

                                            {product.stock_quantity === 0
                                                ? "Out of Stock"
                                                : addingToCart
                                                    ? "Adding..."
                                                    : "Add to Cart"
                                            }

                                        </button>


                                        <button
                                            type="button"
                                            className="wishlist-button"
                                        >
                                            ♡ Add to Wishlist
                                        </button>


                                        <Link
                                            to="/chat"
                                            className="chat-seller-button"
                                        >
                                            💬 Chat with Seller
                                        </Link>

                                    </div>

                                </div>

                            </div>


                            {/* REVIEWS */}

                            <section className="product-reviews">

                                <h2>
                                    Reviews
                                </h2>

                                <div className="review-card">

                                    <div className="review-stars">
                                        ★★★★★
                                    </div>

                                    <p>
                                        No reviews yet. Reviews will appear here later.
                                    </p>

                                </div>

                            </section>

                        </>

                    )}

                </div>

            </main>


            {/* NOTIFICATION */}

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


            <Footer />

        </>
    );
}
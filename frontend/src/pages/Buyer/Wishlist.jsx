import {
    useEffect,
    useState
} from "react";

import { Link }
    from "react-router-dom";

import BuyerNavbar
    from "../../components/Buyer/BuyerNavbar.jsx";

import "../../styles/Buyer/Wishlist.css";
import Notification
    from "../../components/Notification.jsx";


export default function Wishlist() {

    const [wishlist, setWishlist] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const token =
        localStorage.getItem("token");

    const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

    const [productToRemove, setProductToRemove] =
    useState(null);


    // =========================
    // LOAD WISHLIST
    // =========================

    const fetchWishlist =
        async () => {

        try {

            const response =
                await fetch(
                    "http://localhost:5000/api/wishlist",
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
                    "Failed to load wishlist."
                );

            }


            setWishlist(
                data.wishlist || []
            );


        } catch (error) {

            console.error(
                "Wishlist Error:",
                error
            );

            setError(
                error.message
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchWishlist();

    }, []);


    // =========================
    // REMOVE ITEM
    // =========================

    const handleRemove = async () => {

    if (!productToRemove) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:5000/api/wishlist/${productToRemove}`,
            {
                method: "DELETE",

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
                "Failed to remove product."
            );

        }


        setWishlist(
            (current) =>
                current.filter(
                    (item) =>
                        item.product_id?._id !==
                        productToRemove
                )
        );


        setShowDeleteConfirm(false);
        setProductToRemove(null);


    } catch (error) {

        alert(error.message);

    }

};
    return (

        <div className="wishlist-page">

            {showDeleteConfirm && (

        <Notification
            type="confirm"
            message="Are you sure you want to remove this product from your wishlist?"
            onConfirm={handleRemove}
            onCancel={() => {
                setShowDeleteConfirm(false);
                setProductToRemove(null);
            }}
        />

    )}

            <BuyerNavbar />


            <main className="wishlist-container">

                <div className="wishlist-header">

                    <h1>
                        My Wishlist
                    </h1>

                    <p>
                        Products you saved
                        for later.
                    </p>

                </div>


                {loading && (

                    <div className="wishlist-message">

                        Loading wishlist...

                    </div>

                )}


                {!loading &&
                    error && (

                    <div className="wishlist-error">

                        {error}

                    </div>

                )}


                {!loading &&
                    !error &&
                    wishlist.length === 0 && (

                    <div className="wishlist-empty">

                        <h3>
                            Your wishlist is empty
                        </h3>

                        <p>
                            Browse products and save
                            your favourites.
                        </p>

                        <Link
                            to="/products"
                            className="wishlist-shop-button"
                        >
                            Browse Products
                        </Link>

                    </div>

                )}


                {!loading &&
                    !error &&
                    wishlist.length > 0 && (

                    <div className="wishlist-grid">

                        {wishlist.map(
                            (item) => {

                            const product =
                                item.product_id;

                            return (

                                <div
                                    key={item._id}
                                    className="wishlist-card"
                                >

                                    <div className="wishlist-image">

                                        {product?.image
                                            ? (
                                                <img
                                                    src={
                                                        product.image
                                                    }
                                                    alt={
                                                        product.product_name
                                                    }
                                                />
                                            )
                                            : (
                                                <div className="wishlist-placeholder">
                                                    No Image
                                                </div>
                                            )}

                                    </div>


                                    <div className="wishlist-content">

                                        <span className="wishlist-category">

                                            {
                                                product
                                                    ?.category_id
                                                    ?.category_name
                                                ||
                                                "Product"
                                            }

                                        </span>


                                        <h3>

                                            {
                                                product
                                                    ?.product_name
                                                ||
                                                "Product"
                                            }

                                        </h3>


                                        <p className="wishlist-condition">

                                            Condition:{" "}

                                            <strong>
                                                {
                                                    product
                                                        ?.condition
                                                }
                                            </strong>

                                        </p>


                                        <div className="wishlist-price">

                                            Rs.{" "}

                                            {Number(
                                                product?.price || 0
                                            ).toLocaleString()}

                                        </div>


                                        <div className="wishlist-actions">

                                            <Link
                                                to={
                                                    `/products/${product?._id}`
                                                }
                                                className="wishlist-view-button"
                                            >
                                                View Product
                                            </Link>


                                            <button
                                                type="button"
                                                className="wishlist-remove-button"
                                                onClick={() => {
                                                    setProductToRemove(product?._id);
                                                    setShowDeleteConfirm(true);
                                                }}
                                            >
                                                Remove
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                )}

            </main>

        </div>

    );

}
import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";
import Notification from "../../components/Notification.jsx";

import "../../styles/Cart/Cart.css";


export default function Cart() {

    const token =
        localStorage.getItem("token");


    // =========================

    // STATE
    // =========================

    const [, setCart] = useState(null);
    const [items, setItems] =
        useState([]);

    const [total, setTotal] =
        useState(0);

    const [loading, setLoading] =
        useState(Boolean(token));

    const [updatingItemId, setUpdatingItemId] =
        useState(null);

    const [notification, setNotification] =
        useState(null);

    const [itemToRemove, setItemToRemove] =
        useState(null);

    const [clearCartConfirm, setClearCartConfirm] =
        useState(false);


    // =========================
    // GET CART
    // =========================

    const fetchCart = async () => {

        try {

            setLoading(true);

            const response = await fetch(
                "http://localhost:5000/api/cart",
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
                    "Failed to load cart."
                );

            }


            setCart(data.cart);

            setItems(
                data.items || []
            );

            setTotal(
                data.total || 0
            );

        } catch (error) {

            console.error(
                "Cart fetch error:",
                error
            );

            setNotification({
                type: "error",
                message:
                    error.message ||
                    "Unable to load cart."
            });

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // LOAD CART
    // =========================

    useEffect(() => {
        if (!token) {
            return;
        }

        const loadCart = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/cart",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load cart."
                    );
                }

                setCart(data.cart);
                setItems(data.items || []);
                setTotal(data.total || 0);
            } catch (error) {
                console.error("Cart fetch error:", error);
                setNotification({
                    type: "error",
                    message: error.message || "Unable to load cart."
                });
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [token]);


    // =========================
    // NOTIFICATION TIMER
    // =========================

    useEffect(() => {

        if (
            !notification ||
            notification.type === "confirm"
        ) {
            return;
        }


        const timer = setTimeout(() => {

            setNotification(null);

        }, 2000);


        return () =>
            clearTimeout(timer);

    }, [notification]);


    // =========================
    // UPDATE QUANTITY
    // =========================

    const updateQuantity = async (
        item,
        newQuantity
    ) => {

        if (newQuantity < 1) {
            return;
        }


        if (
            newQuantity >
            item.product_id.stock_quantity
        ) {

            setNotification({
                type: "error",
                message:
                    "Not enough stock available."
            });

            return;
        }


        try {

            setUpdatingItemId(
                item._id
            );


            const response = await fetch(
                `http://localhost:5000/api/cart/${item._id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        quantity:
                            newQuantity
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to update quantity."
                );

            }


            await fetchCart();


            // Update navbar badge
            window.dispatchEvent(
                new Event(
                    "cartUpdated"
                )
            );

        } catch (error) {

            console.error(
                "Quantity update error:",
                error
            );

            setNotification({
                type: "error",
                message:
                    error.message ||
                    "Failed to update quantity."
            });

        } finally {

            setUpdatingItemId(
                null
            );

        }

    };


    // =========================
    // ASK REMOVE CONFIRMATION
    // =========================

    const askRemoveItem = (
        item
    ) => {

        setItemToRemove(
            item
        );

        setNotification({
            type: "confirm",
            message:
                `Remove ${item.product_id.product_name} from your cart?`
        });

    };


    // =========================
    // REMOVE ITEM
    // =========================

    const handleRemoveItem = async () => {

        if (!itemToRemove) {
            return;
        }


        try {

            const response = await fetch(
                `http://localhost:5000/api/cart/item/${itemToRemove._id}`,
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
                    "Failed to remove item."
                );

            }


            setItemToRemove(null);


            setNotification({
                type: "success",
                message:
                    "Product removed from cart."
            });


            await fetchCart();


            // Update navbar badge
            window.dispatchEvent(
                new Event(
                    "cartUpdated"
                )
            );

        } catch (error) {

            console.error(
                "Remove item error:",
                error
            );


            setItemToRemove(null);


            setNotification({
                type: "error",
                message:
                    error.message ||
                    "Failed to remove product."
            });

        }

    };


    // =========================
    // CANCEL REMOVE
    // =========================

    const cancelRemoveItem = () => {

        setItemToRemove(null);

        setNotification(null);

    };


    // =========================
    // ASK CLEAR CART
    // =========================

    const askClearCart = () => {

        // Close any normal notification
        setNotification(null);

        setClearCartConfirm(true);

    };


    // =========================
    // CLEAR CART
    // =========================

    const handleClearCart = async () => {

        try {

            const response = await fetch(
                "http://localhost:5000/api/cart",
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
                    "Failed to clear cart."
                );

            }


            setItems([]);

            setTotal(0);

            setCart(null);

            setClearCartConfirm(false);


            setNotification({
                type: "success",
                message:
                    "Cart cleared successfully."
            });


            // Update navbar badge
            window.dispatchEvent(
                new Event(
                    "cartUpdated"
                )
            );

        } catch (error) {

            console.error(
                "Clear cart error:",
                error
            );


            setClearCartConfirm(false);


            setNotification({
                type: "error",
                message:
                    error.message ||
                    "Failed to clear cart."
            });

        }

    };


    // =========================
    // CANCEL CLEAR CART
    // =========================

    const cancelClearCart = () => {

        setClearCartConfirm(false);

    };


    return (
        <>

            <BuyerNavbar />


            <main className="cart-page">

                <div className="cart-container">


                    {/* =========================
                        CART HEADER
                    ========================= */}

                    <div className="cart-header">

                        <div>

                            <h1>
                                Shopping Cart
                            </h1>

                            <p>
                                Review your selected products before checkout.
                            </p>

                        </div>


                        <div className="cart-header-actions">

                            <Link
                                to="/products"
                                className="continue-shopping-link"
                            >
                                ← Continue Shopping
                            </Link>


                            {items.length > 0 && (

                                <button
                                    type="button"
                                    className="clear-cart-button"
                                    onClick={
                                        askClearCart
                                    }
                                >
                                    Clear Cart
                                </button>

                            )}

                        </div>

                    </div>


                    {/* =========================
                        LOADING
                    ========================= */}

                    {loading ? (

                        <div className="cart-message">

                            <h2>
                                Loading your cart...
                            </h2>

                        </div>

                    ) : items.length === 0 ? (


                        /* =========================
                           EMPTY CART
                        ========================= */

                        <div className="empty-cart">

                            <div className="empty-cart-icon">
                                🛒
                            </div>

                            <h2>
                                Your cart is empty
                            </h2>

                            <p>
                                Add some products from UniMart to get started.
                            </p>

                            <Link
                                to="/products"
                                className="shop-now-button"
                            >
                                Browse Products
                            </Link>

                        </div>

                    ) : (


                        /* =========================
                           CART CONTENT
                        ========================= */

                        <div className="cart-layout">


                            {/* =========================
                                CART ITEMS
                            ========================= */}

                            <section className="cart-items-section">

                                {items.map(
                                    (item) => {

                                        const product =
                                            item.product_id;

                                        const subtotal =
                                            Number(
                                                product.price
                                            ) *
                                            item.quantity;


                                        return (

                                            <div
                                                className="cart-item-card"
                                                key={item._id}
                                            >


                                                {/* PRODUCT IMAGE */}

                                                <div className="cart-item-image">

                                                    {product.image ? (

                                                        <img
                                                            src={
                                                                product.image
                                                            }
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


                                                {/* PRODUCT INFO */}

                                                <div className="cart-item-info">

                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        className="cart-product-name"
                                                    >
                                                        {
                                                            product.product_name
                                                        }
                                                    </Link>


                                                    <p className="cart-item-condition">

                                                        Condition:{" "}

                                                        {product.condition
                                                            ? product.condition
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                              product.condition.slice(
                                                                  1
                                                              )
                                                            : "-"
                                                        }

                                                    </p>


                                                    <p className="cart-item-stock">

                                                        {
                                                            product.stock_quantity
                                                        }{" "}
                                                        available

                                                    </p>


                                                    <button
                                                        type="button"
                                                        className="remove-cart-item"
                                                        onClick={() =>
                                                            askRemoveItem(
                                                                item
                                                            )
                                                        }
                                                    >
                                                        Remove
                                                    </button>

                                                </div>


                                                {/* PRICE */}

                                                <div className="cart-item-price">

                                                    <span className="cart-label">
                                                        Price
                                                    </span>

                                                    <strong>
                                                        Rs.{" "}
                                                        {Number(
                                                            product.price
                                                        ).toLocaleString()}
                                                    </strong>

                                                </div>


                                                {/* QUANTITY */}

                                                <div className="cart-item-quantity">

                                                    <span className="cart-label">
                                                        Quantity
                                                    </span>


                                                    <div className="cart-quantity-control">

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item,
                                                                    item.quantity -
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity <=
                                                                    1 ||
                                                                updatingItemId ===
                                                                    item._id
                                                            }
                                                        >
                                                            −
                                                        </button>


                                                        <span>
                                                            {
                                                                item.quantity
                                                            }
                                                        </span>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item,
                                                                    item.quantity +
                                                                        1
                                                                )
                                                            }
                                                            disabled={
                                                                item.quantity >=
                                                                    product.stock_quantity ||
                                                                updatingItemId ===
                                                                    item._id
                                                            }
                                                        >
                                                            +
                                                        </button>

                                                    </div>

                                                </div>


                                                {/* SUBTOTAL */}

                                                <div className="cart-item-subtotal">

                                                    <span className="cart-label">
                                                        Subtotal
                                                    </span>

                                                    <strong>
                                                        Rs.{" "}
                                                        {subtotal.toLocaleString()}
                                                    </strong>

                                                </div>

                                            </div>

                                        );

                                    }
                                )}

                            </section>


                            {/* =========================
                                ORDER SUMMARY
                            ========================= */}

                            <aside className="cart-summary">

                                <h2>
                                    Order Summary
                                </h2>


                                <div className="summary-row">

                                    <span>
                                        Items
                                    </span>

                                    <span>

                                        {items.reduce(
                                            (
                                                count,
                                                item
                                            ) =>
                                                count +
                                                item.quantity,
                                            0
                                        )}

                                    </span>

                                </div>


                                <div className="summary-row">

                                    <span>
                                        Subtotal
                                    </span>

                                    <span>

                                        Rs.{" "}

                                        {Number(
                                            total
                                        ).toLocaleString()}

                                    </span>

                                </div>


                                <div className="summary-row">

                                    <span>
                                        Delivery
                                    </span>

                                    <span>
                                        Calculated at checkout
                                    </span>

                                </div>


                                <div className="summary-divider"></div>


                                <div className="summary-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>

                                        Rs.{" "}

                                        {Number(
                                            total
                                        ).toLocaleString()}

                                    </strong>

                                </div>


                                <Link
                                    to="/checkout"
                                    className="checkout-button"
                                >
                                    Proceed to Checkout
                                </Link>

                            </aside>

                        </div>

                    )}

                </div>

            </main>


            {/* =========================
                REMOVE / NORMAL NOTIFICATION
            ========================= */}

            {notification && (

                <Notification
                    type={
                        notification.type
                    }
                    message={
                        notification.message
                    }
                    onConfirm={
                        notification.type ===
                        "confirm"
                            ? handleRemoveItem
                            : undefined
                    }
                    onCancel={
                        notification.type ===
                        "confirm"
                            ? cancelRemoveItem
                            : undefined
                    }
                />

            )}


            {/* =========================
                CLEAR CART CONFIRMATION
            ========================= */}

            {clearCartConfirm && (

                <Notification
                    type="confirm"
                    message="Are you sure you want to remove all products from your cart?"
                    onConfirm={
                        handleClearCart
                    }
                    onCancel={
                        cancelClearCart
                    }
                />

            )}


            <Footer />

        </>
    );
}
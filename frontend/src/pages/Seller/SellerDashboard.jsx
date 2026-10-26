import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import Notification
    from "../../components/Notification.jsx";

import SellerLayout
    from "../../components/Seller/SellerLayout.jsx";

import "../../styles/Seller/SellerDashboard.css";



export default function SellerDashboard() {

    // =========================
    // STATES
    // =========================

    const [products, setProducts] =
        useState([]);

    const [sellerOrders, setSellerOrders] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const [
        productToDelete,
        setProductToDelete
    ] = useState(null);


    // =========================
    // CURRENT USER
    // =========================

    const user = JSON.parse(
        localStorage.getItem("user")
    );


    const token =
        localStorage.getItem("token");


    const sellerId =
        user?.user_id ||
        user?._id ||
        user?.id;


    // =========================
    // GET SELLER PRODUCTS
    // =========================

    useEffect(() => {

        async function fetchSellerProducts() {

            if (!sellerId) {

                setError(
                    "Seller information not found."
                );

                setLoading(false);

                return;
            }


            try {

                const response = await fetch(
                    `http://localhost:5000/api/products/seller/${sellerId}`
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load products."
                    );

                }


                setProducts(
                    data.products || []
                );


            } catch (error) {

                console.error(
                    "Seller products error:",
                    error
                );


                setError(
                    "Failed to load seller products."
                );


            } finally {

                setLoading(false);

            }

        }


        fetchSellerProducts();

    }, [sellerId]);


    // =========================
    // GET SELLER ORDERS
    // =========================

    useEffect(() => {

        const fetchSellerOrders =
            async () => {

            if (!token) {
                return;
            }


            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/orders/seller-orders",
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
                        "Failed to load seller orders."
                    );

                }


                setSellerOrders(
                    data.orders || []
                );


            } catch (error) {

                console.error(
                    "Seller order statistics error:",
                    error
                );

            }

        };


        fetchSellerOrders();

    }, [token]);


    // =========================
    // STATISTICS
    // =========================

    const totalOrders =
        sellerOrders.length;


    const totalSales =
        sellerOrders
            .filter(
                (order) =>
                    order.order_status === "paid" ||
                    order.order_status === "processing" ||
                    order.order_status === "shipped" ||
                    order.order_status === "completed"
            )
            .reduce(
                (total, order) =>
                    total +
                    Number(
                        order.seller_total || 0
                    ),
                0
            );


    // =========================
    // DELETE PRODUCT
    // =========================

    const handleDeleteProduct =
        async () => {

        if (!productToDelete) {
            return;
        }


        try {

            const response =
                await fetch(
                    `http://localhost:5000/api/products/${productToDelete}`,
                    {
                        method: "DELETE"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to delete product."
                );

            }


            setProducts(
                (previousProducts) =>
                    previousProducts.filter(
                        (product) =>
                            product._id !==
                            productToDelete
                    )
            );


            setProductToDelete(null);


        } catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            setProductToDelete(null);

        }

    };

    return (

    <>

        <SellerLayout>

            <div className="seller-dashboard-main">


                {/* =========================
                    HEADER
                ========================= */}

                <div className="seller-dashboard-heading">

                    <div>

                        <h1>
                            Seller Dashboard
                        </h1>

                        <p>
                            Manage your products,
                            orders and sales.
                        </p>

                    </div>


                    <Link
                        to="/seller/add-product"
                        className="seller-main-add-button"
                    >
                        + Add Product
                    </Link>

                </div>


                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="seller-stats">


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            📦
                        </div>

                        <div>

                            <p>
                                Products
                            </p>

                            <h2>
                                {products.length}
                            </h2>

                        </div>

                    </div>


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            🛒
                        </div>

                        <div>

                            <p>
                                Orders
                            </p>

                            <h2>
                                {totalOrders}
                            </h2>

                        </div>

                    </div>


                    <div className="seller-stat-card">

                        <div className="seller-stat-icon">
                            💰
                        </div>

                        <div>

                            <p>
                                Total Sales
                            </p>

                            <h2>
                                Rs.{" "}
                                {totalSales.toLocaleString()}
                            </h2>

                        </div>

                    </div>


                </section>


                {/* =========================
                    PRODUCTS SECTION
                ========================= */}

                <section
                    className="seller-products-section"
                    id="seller-products"
                >

                    <div className="seller-section-header">

                        <div>

                            <h2>
                                My Products
                            </h2>

                            <p>
                                Manage products you have
                                listed on UniMart.
                            </p>

                        </div>

                    </div>


                    {loading ? (

                        <div className="seller-empty-products">

                            <p>
                                Loading products...
                            </p>

                        </div>

                    ) : error ? (

                        <div className="seller-empty-products">

                            <p>
                                {error}
                            </p>

                        </div>

                    ) : products.length === 0 ? (

                        <div className="seller-empty-products">

                            <div className="seller-empty-icon">
                                📦
                            </div>

                            <h3>
                                No products yet
                            </h3>

                            <p>
                                Start selling by adding
                                your first product.
                            </p>

                            <Link
                                to="/seller/add-product"
                                className="seller-empty-add-button"
                            >
                                Add Product
                            </Link>

                        </div>

                    ) : (

                        <div className="seller-products-list">

                            {products.map(
                                (product) => (

                                <div
                                    className="seller-product-row"
                                    key={product._id}
                                >


                                    <div className="seller-product-info">

                                        <h3>
                                            {
                                                product.product_name
                                            }
                                        </h3>

                                        <p>

                                            {
                                                product.category_id
                                                    ?.category_name
                                            }

                                            {" • "}

                                            {
                                                product.condition
                                            }

                                            {" • "}

                                            Stock:{" "}

                                            {
                                                product.stock_quantity
                                            }

                                        </p>

                                    </div>


                                    <div className="seller-product-price">

                                        Rs.{" "}

                                        {Number(
                                            product.price
                                        ).toLocaleString()}

                                    </div>


                                    <div className="seller-product-actions">

                                        <Link
                                            to={`/products/${product._id}`}
                                            className="seller-product-action view"
                                        >
                                            View
                                        </Link>


                                        <Link
                                            to={`/seller/edit-product/${product._id}`}
                                            className="seller-product-action edit"
                                        >
                                            Edit
                                        </Link>


                                        <button
                                            type="button"
                                            className="seller-product-action delete"
                                            onClick={() =>
                                                setProductToDelete(
                                                    product._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </div>

        </SellerLayout>


        {productToDelete && (

            <Notification
                type="confirm"
                message="Are you sure you want to delete this product?"
                onConfirm={
                    handleDeleteProduct
                }
                onCancel={() =>
                    setProductToDelete(null)
                }
            />

        )}

    </>

);
}
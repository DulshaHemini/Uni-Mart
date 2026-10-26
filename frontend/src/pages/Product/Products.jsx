import {
    useEffect,
    useState
} from "react";

import {
    Link,
    useSearchParams
} from "react-router-dom";

import Navbar
    from "../../components/Navbar.jsx";

import BuyerNavbar
    from "../../components/Buyer/BuyerNavbar.jsx";

import Footer
    from "../../components/Footer.jsx";

import Notification
    from "../../components/Notification.jsx";

import "../../styles/Products/Products.css";


export default function Products() {

    // =========================
    // STATES
    // =========================

    const [products, setProducts] =
        useState([]);

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [searchTerm, setSearchTerm] =
        useState("");

    const [
        selectedCategories,
        setSelectedCategories
    ] = useState([]);

    const [
        selectedConditions,
        setSelectedConditions
    ] = useState([]);

    const [sortOption, setSortOption] =
        useState("latest");

    const [notification, setNotification] =
        useState(null);

    const [
        wishlistLoadingId,
        setWishlistLoadingId
    ] = useState(null);


    // =========================
    // URL PARAMETERS
    // =========================

    const [searchParams] =
        useSearchParams();


    const categoryFromUrl =
        searchParams.get("category");


    const searchFromUrl =
        searchParams.get("search");


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
    // AUTO HIDE NOTIFICATION
    // =========================

    useEffect(() => {

        if (!notification) {
            return;
        }


        const timer =
            setTimeout(() => {

                setNotification(null);

            }, 2000);


        return () =>
            clearTimeout(timer);

    }, [notification]);


    // =========================
    // GET PRODUCTS
    // =========================

    useEffect(() => {

        const fetchProducts =
            async () => {

            try {

                setLoading(true);

                setError("");


                const response =
                    await fetch(
                        "http://localhost:5000/api/products"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load products"
                    );

                }


                setProducts(
                    data.products || []
                );


            } catch (error) {

                console.error(
                    "Product fetch error:",
                    error
                );


                setError(
                    "Unable to load products."
                );


            } finally {

                setLoading(false);

            }

        };


        fetchProducts();

    }, []);


    // =========================
    // GET CATEGORIES
    // =========================

    useEffect(() => {

        const fetchCategories =
            async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/categories"
                    );


                const data =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Failed to load categories."
                    );

                }


                setCategories(
                    data.categories || []
                );


            } catch (error) {

                console.error(
                    "Category fetch error:",
                    error
                );

            }

        };


        fetchCategories();

    }, []);


    // =========================
    // CATEGORY FROM URL
    // =========================

    useEffect(() => {

        if (categoryFromUrl) {

            setSelectedCategories([
                categoryFromUrl
            ]);

        } else {

            setSelectedCategories([]);

        }

    }, [categoryFromUrl]);


    // =========================
    // SEARCH FROM URL
    // =========================

    useEffect(() => {

        if (searchFromUrl) {

            setSearchTerm(
                searchFromUrl
            );

        } else {

            setSearchTerm("");

        }

    }, [searchFromUrl]);


    // =========================
    // CATEGORY FILTER CHANGE
    // =========================

    const handleCategoryChange =
        (categoryName) => {

        setSelectedCategories(
            (previousCategories) => {

                if (
                    previousCategories.includes(
                        categoryName
                    )
                ) {

                    return previousCategories.filter(
                        (category) =>
                            category !== categoryName
                    );

                }


                return [
                    ...previousCategories,
                    categoryName
                ];

            }
        );

    };


    // =========================
    // CONDITION FILTER CHANGE
    // =========================

    const handleConditionChange =
        (conditionName) => {

        setSelectedConditions(
            (previousConditions) => {

                if (
                    previousConditions.includes(
                        conditionName
                    )
                ) {

                    return previousConditions.filter(
                        (condition) =>
                            condition !== conditionName
                    );

                }


                return [
                    ...previousConditions,
                    conditionName
                ];

            }
        );

    };


    // =========================
    // FILTER PRODUCTS
    // =========================

    const filteredProducts =
        products.filter(
            (product) => {

            // SEARCH

            const matchesSearch =
                product.product_name
                    ?.toLowerCase()
                    .includes(
                        searchTerm
                            .toLowerCase()
                    );


            // CATEGORY

            let productCategory = "";


            if (
                product.category_id &&
                typeof product.category_id === "object"
            ) {

                productCategory =
                    product.category_id
                        ?.category_name || "";

            } else {

                const matchingCategory =
                    categories.find(
                        (category) =>
                            category._id ===
                            product.category_id
                    );


                productCategory =
                    matchingCategory
                        ?.category_name || "";

            }


            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(
                    productCategory
                );


            // CONDITION

            const matchesCondition =
                selectedConditions.length === 0 ||
                selectedConditions.includes(
                    product.condition
                );


            return (
                matchesSearch &&
                matchesCategory &&
                matchesCondition
            );

        });


    // =========================
    // SORT PRODUCTS
    // =========================

    const sortedProducts =
        [...filteredProducts].sort(
            (a, b) => {

            if (
                sortOption === "price-low"
            ) {

                return (
                    Number(a.price) -
                    Number(b.price)
                );

            }


            if (
                sortOption === "price-high"
            ) {

                return (
                    Number(b.price) -
                    Number(a.price)
                );

            }


            if (
                sortOption === "latest"
            ) {

                return (
                    new Date(
                        b.created_at ||
                        b.createdAt ||
                        0
                    ) -
                    new Date(
                        a.created_at ||
                        a.createdAt ||
                        0
                    )
                );

            }


            return 0;

        });


    // =========================
    // ADD TO WISHLIST
    // =========================

    const handleAddToWishlist =
        async (productId) => {

        if (!token || !user) {

            setNotification({
                type: "error",
                message:
                    "Please login as a buyer to use the wishlist."
            });

            return;
        }


        if (!isBuyer) {

            setNotification({
                type: "error",
                message:
                    "Only buyers can use the wishlist."
            });

            return;
        }


        try {

            setWishlistLoadingId(
                productId
            );


            const response =
                await fetch(
                    "http://localhost:5000/api/wishlist",
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
                                productId
                        })
                    }
                );


            const data =
                await response.json();


            if (
                response.status === 409
            ) {

                setNotification({
                    type: "error",
                    message:
                        "This product is already in your wishlist."
                });

                return;
            }


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to add product to wishlist."
                );

            }


            setNotification({
                type: "success",
                message:
                    "Product added to wishlist."
            });


        } catch (error) {

            setNotification({
                type: "error",
                message:
                    error.message ||
                    "Failed to add product to wishlist."
            });


        } finally {

            setWishlistLoadingId(null);

        }

    };


    return (

        <>

            {/* =========================
                NAVBAR
            ========================= */}

            {isBuyer ? (

                <BuyerNavbar />

            ) : (

                <Navbar />

            )}


            {/* =========================
                PRODUCTS PAGE
            ========================= */}

            <div className="products-page">

                <main className="products-container">


                    {/* HEADER */}

                    <div className="products-header">

                        <div className="products-title">

                            <h1>
                                Products
                            </h1>

                            <p>
                                Discover products from
                                students around your university.
                            </p>

                        </div>


                        {/* SEARCH */}

                        <div className="products-search">

                            <span>
                                🔍
                            </span>


                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(event) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                    </div>


                    {/* =========================
                        PRODUCTS LAYOUT
                    ========================= */}

                    <div className="products-layout">


                        {/* =========================
                            FILTERS
                        ========================= */}

                        <aside className="products-filters">

                            <h2>
                                Filters
                            </h2>


                            {/* CATEGORY */}

                            <div className="filter-group">

                                <h3>
                                    Category
                                </h3>


                                {categories.length === 0 ? (

                                    <p className="filter-empty">
                                        No categories available.
                                    </p>

                                ) : (

                                    categories.map(
                                        (category) => (

                                        <label
                                            key={
                                                category._id
                                            }
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedCategories.includes(
                                                        category.category_name
                                                    )
                                                }
                                                onChange={() =>
                                                    handleCategoryChange(
                                                        category.category_name
                                                    )
                                                }
                                            />


                                            <span>

                                                {
                                                    category.icon ||
                                                    "🛍️"
                                                }

                                                {" "}

                                                {
                                                    category.category_name
                                                }

                                            </span>

                                        </label>

                                    ))

                                )}

                            </div>


                            {/* CONDITION */}

                            <div className="filter-group">

                                <h3>
                                    Condition
                                </h3>


                                <label>

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedConditions.includes(
                                                "new"
                                            )
                                        }
                                        onChange={() =>
                                            handleConditionChange(
                                                "new"
                                            )
                                        }
                                    />

                                    New

                                </label>


                                <label>

                                    <input
                                        type="checkbox"
                                        checked={
                                            selectedConditions.includes(
                                                "used"
                                            )
                                        }
                                        onChange={() =>
                                            handleConditionChange(
                                                "used"
                                            )
                                        }
                                    />

                                    Used

                                </label>

                            </div>

                        </aside>


                        {/* =========================
                            PRODUCTS
                        ========================= */}

                        <section className="products-section">


                            {/* TOOLBAR */}

                            <div className="products-toolbar">

                                <p>

                                    {sortedProducts.length} product

                                    {
                                        sortedProducts.length !== 1
                                            ? "s"
                                            : ""
                                    }

                                    {" "}found

                                </p>


                                <select
                                    value={sortOption}
                                    onChange={(event) =>
                                        setSortOption(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="latest">
                                        Latest
                                    </option>

                                    <option value="price-low">
                                        Price: Low to High
                                    </option>

                                    <option value="price-high">
                                        Price: High to Low
                                    </option>

                                </select>

                            </div>


                            {/* LOADING */}

                            {loading && (

                                <div className="no-products">

                                    <h2>
                                        Loading products...
                                    </h2>

                                </div>

                            )}


                            {/* ERROR */}

                            {!loading &&
                                error && (

                                <div className="no-products">

                                    <h2>
                                        Unable to load products
                                    </h2>

                                    <p>
                                        {error}
                                    </p>

                                </div>

                            )}


                            {/* =========================
                                PRODUCT GRID
                            ========================= */}

                            {!loading &&
                                !error &&
                                sortedProducts.length > 0 && (

                                <div className="product-grid">

                                    {sortedProducts.map(
                                        (product) => (

                                        <div
                                            className="product-card"
                                            key={product._id}
                                        >


                                            {/* WISHLIST */}

                                            {isBuyer && (

                                                <button
                                                    type="button"
                                                    className="product-wishlist-button"
                                                    title="Add to Wishlist"
                                                    onClick={() =>
                                                        handleAddToWishlist(
                                                            product._id
                                                        )
                                                    }
                                                    disabled={
                                                        wishlistLoadingId ===
                                                        product._id
                                                    }
                                                >

                                                    {
                                                        wishlistLoadingId ===
                                                        product._id
                                                            ? "..."
                                                            : "♡"
                                                    }

                                                </button>

                                            )}


                                            {/* PRODUCT IMAGE */}

                                            <div className="product-image">

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

                                            <div className="product-info">

                                                <h3>
                                                    {
                                                        product.product_name
                                                    }
                                                </h3>


                                                <p className="product-price">

                                                    Rs.{" "}

                                                    {Number(
                                                        product.price
                                                    ).toLocaleString()}

                                                </p>


                                                <p className="product-condition">

                                                    {
                                                        product.condition
                                                            ? product.condition
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                            product.condition
                                                                .slice(1)
                                                            : ""
                                                    }

                                                </p>


                                                <Link
                                                    to={`/products/${product._id}`}
                                                    className="product-view-button"
                                                >
                                                    View
                                                </Link>

                                            </div>

                                        </div>

                                    ))}

                                </div>

                            )}


                            {/* =========================
                                NO PRODUCTS
                            ========================= */}

                            {!loading &&
                                !error &&
                                sortedProducts.length === 0 && (

                                <div className="no-products">

                                    <h2>
                                        No products found
                                    </h2>

                                    <p>
                                        Try changing your
                                        search or filters.
                                    </p>

                                </div>

                            )}

                        </section>

                    </div>

                </main>

            </div>


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
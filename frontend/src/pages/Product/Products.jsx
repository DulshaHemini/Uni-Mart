import { useEffect, useState } from "react";
import {
    Link,
    useSearchParams
} from "react-router-dom";

import Navbar from "../../components/Navbar.jsx";
import BuyerNavbar from "../../components/Buyer/BuyerNavbar.jsx";
import Footer from "../../components/Footer.jsx";

import "../../styles/Products/Products.css";


export default function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [sortOption, setSortOption] = useState("latest");

    const [searchParams] = useSearchParams();

    const categoryFromUrl =
        searchParams.get("category");


    // =========================
    // CHECK CURRENT USER
    // =========================

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const isBuyer = user?.role === "buyer";


    // =========================
    // GET PRODUCTS FROM BACKEND
    // =========================

    useEffect(() => {

        const fetchProducts = async () => {

            try {

                setLoading(true);
                setError("");

                const response = await fetch(
                    "http://localhost:5000/api/products"
                );

                const data = await response.json();

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
    // CATEGORY FILTER
    // =========================

    const handleCategoryChange = (categoryName) => {

        setSelectedCategories((prevCategories) => {

            if (
                prevCategories.includes(categoryName)
            ) {

                return prevCategories.filter(
                    (category) =>
                        category !== categoryName
                );

            }

            return [
                ...prevCategories,
                categoryName
            ];

        });

    };


    // =========================
    // CONDITION FILTER
    // =========================

    const handleConditionChange = (conditionName) => {

        setSelectedConditions((prevConditions) => {

            if (
                prevConditions.includes(conditionName)
            ) {

                return prevConditions.filter(
                    (condition) =>
                        condition !== conditionName
                );

            }

            return [
                ...prevConditions,
                conditionName
            ];

        });

    };


    // =========================
    // AVAILABLE CATEGORIES
    // =========================

    const availableCategories = [
        ...new Set(
            products
                .map(
                    (product) =>
                        product.category_id
                            ?.category_name
                )
                .filter(Boolean)
        )
    ];


    // =========================
    // FILTER PRODUCTS
    // =========================

    const filteredProducts =
        products.filter((product) => {

            const matchesSearch =
                product.product_name
                    ?.toLowerCase()
                    .includes(
                        searchTerm.toLowerCase()
                    );


            const productCategory =
                product.category_id
                    ?.category_name;


            const matchesCategory =
                selectedCategories.length === 0 ||
                selectedCategories.includes(
                    productCategory
                );


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
        [...filteredProducts].sort((a, b) => {

            if (sortOption === "price-low") {
                return a.price - b.price;
            }

            if (sortOption === "price-high") {
                return b.price - a.price;
            }

            if (sortOption === "latest") {

                return (
                    new Date(b.created_at) -
                    new Date(a.created_at)
                );

            }

            return 0;

        });


    return (
        <>

            {/* =========================
                NAVBAR

                Public user -> Navbar
                Buyer -> BuyerNavbar
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


                    {/* =========================
                        HEADER
                    ========================= */}

                    <div className="products-header">

                        <div className="products-title">

                            <h1>
                                Products
                            </h1>

                            <p>
                                Discover products from students
                                around your university.
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
                                onChange={(e) =>
                                    setSearchTerm(
                                        e.target.value
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

                                {availableCategories.map(
                                    (categoryName) => (

                                        <label
                                            key={categoryName}
                                        >

                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedCategories.includes(
                                                        categoryName
                                                    )
                                                }
                                                onChange={() =>
                                                    handleCategoryChange(
                                                        categoryName
                                                    )
                                                }
                                            />

                                            {categoryName}

                                        </label>

                                    )
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

                                    {sortedProducts.length !== 1
                                        ? "s"
                                        : ""
                                    } found

                                </p>


                                <select
                                    value={sortOption}
                                    onChange={(e) =>
                                        setSortOption(
                                            e.target.value
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


                            {/* =========================
                                LOADING
                            ========================= */}

                            {loading && (

                                <div className="no-products">

                                    <h2>
                                        Loading products...
                                    </h2>

                                </div>

                            )}


                            {/* =========================
                                ERROR
                            ========================= */}

                            {!loading && error && (

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


                                                        <Link
                                                            to={`/products/${product._id}`}
                                                            className="product-view-button"
                                                        >
                                                            View
                                                        </Link>

                                                    </div>

                                                </div>

                                            )
                                        )}

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


            {/* =========================
                COMMON FOOTER
            ========================= */}

            <Footer />

        </>
    );
}
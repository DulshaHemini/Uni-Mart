import {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import "../styles/Categories.css";


export default function Categories() {

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function fetchCategories() {

            try {

                const response = await fetch(
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


                setError(
                    error.message
                );


            } finally {

                setLoading(false);

            }

        }


        fetchCategories();

    }, []);


    return (

        <section
            id="categories"
            className="categories-section"
        >

            <div className="categories-container">

                <div className="categories-header">

                    <h2>
                        Categories
                    </h2>

                    <p>
                        Find what you need from fellow university students.
                    </p>

                </div>


                {loading ? (

                    <p className="categories-message">
                        Loading categories...
                    </p>

                ) : error ? (

                    <p className="categories-error">
                        {error}
                    </p>

                ) : categories.length === 0 ? (

                    <p className="categories-message">
                        No categories available.
                    </p>

                ) : (

                    <div className="categories-grid">

                        {categories.map(
                            (category) => (

                            <Link
                                to={`/products?category=${encodeURIComponent(
                                    category._id
                                )}`}
                                className="category-card"
                                key={category._id}
                            >

                                <div className="category-icon">
                                    {
                                        category.icon ||
                                        "🛍️"
                                    }
                                </div>


                                <h3>
                                    {
                                        category.category_name
                                    }
                                </h3>


                                <p className="category-description">
                                    {
                                        category.description
                                    }
                                </p>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        </section>

    );
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../styles/Categories.css";

export default function Categories() {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);


    const categoryIcons = {
        Books: "📚",
        Electronics: "💻",
        Clothing: "👕",
        Stationery: "✏️"
    };


    useEffect(() => {

        async function fetchCategories() {

            try {

                const response = await fetch(
                    "http://localhost:5000/api/categories"
                );

                const data = await response.json();

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

                console.log(
                    "Category fetch error:",
                    error
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

                    <p>
                        Loading categories...
                    </p>

                ) : (

                    <div className="categories-grid">

                        {categories.map((category) => (

                            <Link
                                to={`/products?category=${encodeURIComponent(
                                    category.category_name
                                )}`}
                                className="category-card"
                                key={category._id}
                            >

                                <div className="category-icon">

                                    {
                                        categoryIcons[
                                            category.category_name
                                        ] || "🛍️"
                                    }

                                </div>

                                <h3>
                                    {category.category_name}
                                </h3>

                            </Link>

                        ))}

                    </div>

                )}

            </div>

        </section>
    );
}
import { Link } from "react-router-dom";
import "../styles/Categories.css";

export default function Categories() {
    const categories = [
    {
        name: "Books",
        icon: "📚"
    },
    {
        name: "Electronics",
        icon: "💻"
    },
    {
        name: "Clothing",
        icon: "👕"
    },
    {
        name: "Stationery",
        icon: "✏️"
    }
];

return (
    <section id="categories" className="categories-section">

        <div className="categories-container">

            <div className="categories-header">
                <h2>Categories</h2>

                <p>
                    Find what you need from fellow university students.
                </p>
            </div>

            <div className="categories-grid">

                {categories.map((category) => (

                    <Link
                        to="/products"
                        className="category-card"
                        key={category.name}
                    >

                        <div className="category-icon">
                            {category.icon}
                        </div>

                        <h3>
                            {category.name}
                        </h3>

                    </Link>

                ))}

            </div>

        </div>

    </section>
);
}
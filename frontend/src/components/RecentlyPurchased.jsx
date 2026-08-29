import "../styles/RecentlyPurchased.css";

export default function RecentlyPurchased() {

    const products = [
        {
            name: "University Textbook",
            price: "Rs. 500",
            image: "📚",
            time: "12 minutes ago"
        },
        {
            name: "Scientific Calculator",
            price: "Rs. 1,200",
            image: "🧮",
            time: "25 minutes ago"
        },
        {
            name: "Student Backpack",
            price: "Rs. 800",
            image: "🎒",
            time: "40 minutes ago"
        },
        {
            name: "Notebook Set",
            price: "Rs. 250",
            image: "📓",
            time: "1 hour ago"
        }
    ];

    return (
        <section className="recently-purchased">

            <div className="recently-purchased-container">

                <div className="recently-purchased-header">

                    <h2>
                        Recently Purchased by Students
                    </h2>

                    <p>
                        See what's popular among UniMart buyers
                    </p>

                </div>


                <div className="recently-purchased-grid">

                    {products.map((product, index) => (

                        <div
                            className="recently-purchased-card"
                            key={index}
                        >

                            <div className="recently-purchased-image">
                                {product.image}
                            </div>


                            <div className="recently-purchased-info">

                                <h3>
                                    {product.name}
                                </h3>

                                <p className="recently-purchased-price">
                                    {product.price}
                                </p>

                                <span className="purchased-time">
                                    {product.time}
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

        </section>
    );
}
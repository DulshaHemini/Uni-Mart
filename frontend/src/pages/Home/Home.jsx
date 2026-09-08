import Navbar from "../../components/Navbar.jsx";
import Hero from "../../components/Hero.jsx";
import Categories from "../../components/Categories.jsx";
import FeaturedProducts from "../Product/FeaturedProducts.jsx";
import RecentlyPurchased from "../Product/RecentlyPurchased.jsx";
import HowItWorks from "../../components/HowItWorks.jsx";
import SellerCTA from "../../components/SellerCTA.jsx";
import Footer from "../../components/Footer.jsx";

export default function Home() {
    return (
        <>
            <Navbar />
            <Hero />
            <Categories />
            <FeaturedProducts />
             <RecentlyPurchased />
            <HowItWorks />
            <SellerCTA />
            <Footer />
        </>
    );
}
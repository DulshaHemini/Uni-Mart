
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

import User from "./models/User.js";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import Cart from "./models/Cart.js";
import CartItem from "./models/CartItem.js";
import Wishlist from "./models/Wishlist.js";
import Order from "./models/Order.js";
import OrderItem from "./models/OrderItem.js";
import Payment from "./models/Payment.js";

dotenv.config();

const EXPECTED_DATABASE = "test";
const DEMO_PASSWORD = "UniMartDemo123!";

const upsertOptions = {
    upsert: true,
    new: true,
    runValidators: true,
    setDefaultsOnInsert: true
};

async function seedTestData() {
    if (!process.env.MONGO_URI) {
        throw new Error(
            "MONGO_URI is missing from backend/.env"
        );
    }

    await mongoose.connect(process.env.MONGO_URI);

    const databaseName =
        mongoose.connection.db.databaseName;

    console.log("Connected database:", databaseName);

    // Safety check: never seed another database accidentally.
    if (databaseName !== EXPECTED_DATABASE) {
        throw new Error(
            `Wrong database "${databaseName}". ` +
            `Expected "${EXPECTED_DATABASE}". No test data was added.`
        );
    }

    // ---------------------------------------
    // 1. CREATE DEMO USERS
    // ---------------------------------------

    const passwordHash = await bcrypt.hash(
        DEMO_PASSWORD,
        10
    );

    const userSpecs = [
        {
            key: "admin",
            email: "admin@unimart.test",
            first_name: "UniMart",
            last_name: "Admin",
            phone_number: "0770000001",
            role: "admin"
        },
        {
            key: "sellerTech",
            email: "seller.tech@unimart.test",
            first_name: "Tech",
            last_name: "Seller",
            phone_number: "0770000002",
            role: "seller"
        },
        {
            key: "sellerHome",
            email: "seller.home@unimart.test",
            first_name: "Home",
            last_name: "Seller",
            phone_number: "0770000003",
            role: "seller"
        },
        {
            key: "buyer1",
            email: "buyer.one@unimart.test",
            first_name: "Amaya",
            last_name: "Perera",
            phone_number: "0770000004",
            role: "buyer",
            shipping_address: "24 Demo Street",
            shipping_city: "Colombo",
            shipping_postal_code: "00500",
            billing_address: "24 Demo Street",
            billing_city: "Colombo",
            billing_postal_code: "00500"
        },
        {
            key: "buyer2",
            email: "buyer.two@unimart.test",
            first_name: "Kavindu",
            last_name: "Silva",
            phone_number: "0770000005",
            role: "buyer",
            shipping_address: "12 Sample Road",
            shipping_city: "Dehiwala",
            shipping_postal_code: "10350",
            billing_address: "12 Sample Road",
            billing_city: "Dehiwala",
            billing_postal_code: "10350"
        },
        {
            key: "buyer3",
            email: "buyer.three@unimart.test",
            first_name: "Nethmi",
            last_name: "Fernando",
            phone_number: "0770000006",
            role: "buyer"
        }
    ];

    const users = {};

    for (const spec of userSpecs) {
        const { key, ...userData } = spec;

        users[key] = await User.findOneAndUpdate(
            { email: userData.email },
            {
                $set: {
                    ...userData,
                    password: passwordHash,
                    is_block: false,
                    is_email_verified: true
                }
            },
            upsertOptions
        );
    }

    console.log("Created/updated 6 demo users.");

    // ---------------------------------------
    // 2. CREATE CATEGORIES
    // ---------------------------------------

    const categorySpecs = [
        {
            category_name: "Electronics",
            description: "Phones, computers and accessories",
            icon: "💻"
        },
        {
            category_name: "Fashion",
            description: "Clothing, shoes and accessories",
            icon: "👕"
        },
        {
            category_name: "Home & Living",
            description: "Useful products for your home",
            icon: "🏠"
        },
        {
            category_name: "Books & Stationery",
            description: "Books, notebooks and stationery",
            icon: "📚"
        },
        {
            category_name: "Sports & Outdoors",
            description: "Fitness and outdoor products",
            icon: "⚽"
        }
    ];

    const categories = {};

    for (const categoryData of categorySpecs) {
        categories[categoryData.category_name] =
            await Category.findOneAndUpdate(
                {
                    category_name:
                        categoryData.category_name
                },
                { $set: categoryData },
                upsertOptions
            );
    }

    console.log("Created/updated 5 categories.");

    // ---------------------------------------
    // 3. CREATE PRODUCTS
    // ---------------------------------------

    const productSpecs = [
        {
            key: "smartphone",
            sellerKey: "sellerTech",
            categoryName: "Electronics",
            product_name: "Smartphone",
            description:
                "A modern smartphone for everyday use.",
            price: 89900,
            condition: "new",
            stock_quantity: 12,
            image:
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "headphones",
            sellerKey: "sellerTech",
            categoryName: "Electronics",
            product_name: "Wireless Headphones",
            description:
                "Wireless headphones for music and calls.",
            price: 12900,
            condition: "new",
            stock_quantity: 20,
            image:
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "laptopStand",
            sellerKey: "sellerTech",
            categoryName: "Electronics",
            product_name: "Laptop Stand",
            description:
                "A stand for a comfortable desk setup.",
            price: 7500,
            condition: "new",
            stock_quantity: 15,
            image:
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "mouse",
            sellerKey: "sellerTech",
            categoryName: "Electronics",
            product_name: "Wireless Mouse",
            description:
                "A compact wireless computer mouse.",
            price: 3500,
            condition: "new",
            stock_quantity: 25,
            image:
                "https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "shoes",
            sellerKey: "sellerHome",
            categoryName: "Fashion",
            product_name: "Running Shoes",
            description:
                "Comfortable shoes for walking and running.",
            price: 11900,
            condition: "new",
            stock_quantity: 18,
            image:
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "backpack",
            sellerKey: "sellerHome",
            categoryName: "Fashion",
            product_name: "Everyday Backpack",
            description:
                "A practical backpack for study and travel.",
            price: 8500,
            condition: "used",
            stock_quantity: 5,
            image:
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "lamp",
            sellerKey: "sellerHome",
            categoryName: "Home & Living",
            product_name: "Desk Lamp",
            description:
                "A desk lamp for reading and studying.",
            price: 4500,
            condition: "new",
            stock_quantity: 10,
            image:
                "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "coffeeMaker",
            sellerKey: "sellerHome",
            categoryName: "Home & Living",
            product_name: "Coffee Maker",
            description:
                "A compact coffee maker for home use.",
            price: 13900,
            condition: "new",
            stock_quantity: 8,
            image:
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "notebooks",
            sellerKey: "sellerTech",
            categoryName: "Books & Stationery",
            product_name: "Notebook Set",
            description:
                "A set of notebooks for school and university.",
            price: 1800,
            condition: "new",
            stock_quantity: 30,
            image:
                "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80"
        },
        {
            key: "yogaMat",
            sellerKey: "sellerHome",
            categoryName: "Sports & Outdoors",
            product_name: "Yoga Mat",
            description:
                "A mat for home workouts and stretching.",
            price: 4200,
            condition: "new",
            stock_quantity: 16,
            image:
                "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80"
        }
    ];

    const products = {};

    for (const spec of productSpecs) {
        const {
            key,
            sellerKey,
            categoryName,
            ...productData
        } = spec;

        products[key] =
            await Product.findOneAndUpdate(
                {
                    seller_id: users[sellerKey]._id,
                    product_name: productData.product_name
                },
                {
                    $set: {
                        ...productData,
                        seller_id: users[sellerKey]._id,
                        category_id:
                            categories[categoryName]._id,
                        status: "active"
                    }
                },
                upsertOptions
            );
    }

    console.log("Created/updated 10 products.");

    // ---------------------------------------
    // 4. CREATE CARTS AND CART ITEMS
    // ---------------------------------------

    const cart1 = await Cart.findOneAndUpdate(
        { user_id: users.buyer1._id },
        { $set: { user_id: users.buyer1._id } },
        upsertOptions
    );

    const cart2 = await Cart.findOneAndUpdate(
        { user_id: users.buyer2._id },
        { $set: { user_id: users.buyer2._id } },
        upsertOptions
    );

    const cartItems = [
        {
            cart_id: cart1._id,
            product_id: products.headphones._id,
            quantity: 1
        },
        {
            cart_id: cart1._id,
            product_id: products.mouse._id,
            quantity: 2
        },
        {
            cart_id: cart2._id,
            product_id: products.lamp._id,
            quantity: 1
        }
    ];

    for (const item of cartItems) {
        await CartItem.findOneAndUpdate(
            {
                cart_id: item.cart_id,
                product_id: item.product_id
            },
            { $set: item },
            upsertOptions
        );
    }

    console.log("Created/updated 2 carts and 3 cart items.");

    // ---------------------------------------
    // 5. CREATE WISHLIST ENTRIES
    // ---------------------------------------

    const wishlistItems = [
        {
            user_id: users.buyer1._id,
            product_id: products.laptopStand._id
        },
        {
            user_id: users.buyer2._id,
            product_id: products.yogaMat._id
        }
    ];

    for (const item of wishlistItems) {
        await Wishlist.findOneAndUpdate(
            item,
            { $set: item },
            upsertOptions
        );
    }

    console.log("Created/updated 2 wishlist entries.");

    // ---------------------------------------
    // 6. CREATE DEMO ORDERS
    // ---------------------------------------

    const order1 = await Order.findOneAndUpdate(
        { order_code: "TEST-UNI-1001" },
        {
            $set: {
                user_id: users.buyer1._id,
                order_code: "TEST-UNI-1001",
                shipping_address: "24 Demo Street",
                shipping_city: "Colombo",
                shipping_postal_code: "00500",
                billing_address: "24 Demo Street",
                billing_city: "Colombo",
                billing_postal_code: "00500",
                phone_number: "0770000004",
                total_amount: 21400,
                order_status: "pending"
            }
        },
        upsertOptions
    );

    const order2 = await Order.findOneAndUpdate(
        { order_code: "TEST-UNI-1002" },
        {
            $set: {
                user_id: users.buyer2._id,
                order_code: "TEST-UNI-1002",
                shipping_address: "12 Sample Road",
                shipping_city: "Dehiwala",
                shipping_postal_code: "10350",
                billing_address: "12 Sample Road",
                billing_city: "Dehiwala",
                billing_postal_code: "10350",
                phone_number: "0770000005",
                total_amount: 4500,
                order_status: "cancelled"
            }
        },
        upsertOptions
    );

    const orderItems = [
        {
            order_id: order1._id,
            product_id: products.headphones._id,
            quantity: 1,
            price: 12900,
            subtotal: 12900
        },
        {
            order_id: order1._id,
            product_id: products.backpack._id,
            quantity: 1,
            price: 8500,
            subtotal: 8500
        },
        {
            order_id: order2._id,
            product_id: products.lamp._id,
            quantity: 1,
            price: 4500,
            subtotal: 4500
        }
    ];

    for (const item of orderItems) {
        await OrderItem.findOneAndUpdate(
            {
                order_id: item.order_id,
                product_id: item.product_id
            },
            { $set: item },
            upsertOptions
        );
    }

    await Payment.findOneAndUpdate(
        { order_id: order1._id },
        {
            $set: {
                order_id: order1._id,
                payment_method: "PayHere",
                payment_status: "pending",
                amount: 21400,
                payhere_payment_id: ""
            }
        },
        upsertOptions
    );

    await Payment.findOneAndUpdate(
        { order_id: order2._id },
        {
            $set: {
                order_id: order2._id,
                payment_method: "PayHere",
                payment_status: "cancelled",
                amount: 4500,
                payhere_payment_id: ""
            }
        },
        upsertOptions
    );

    console.log("Created/updated 2 demo orders, 3 order items, and 2 payments.");

    // ---------------------------------------
    // 7. PRINT SUMMARY
    // ---------------------------------------

    console.log("\n========== UNIMART TEST DATA ==========");
    console.log("Database: test");
    console.log("Users:", await User.countDocuments());
    console.log("Categories:", await Category.countDocuments());
    console.log("Products:", await Product.countDocuments());
    console.log("Carts:", await Cart.countDocuments());
    console.log("Cart items:", await CartItem.countDocuments());
    console.log("Wishlists:", await Wishlist.countDocuments());
    console.log("Orders:", await Order.countDocuments());
    console.log("Order items:", await OrderItem.countDocuments());
    console.log("Payments:", await Payment.countDocuments());

    console.log("\nDemo login password:", DEMO_PASSWORD);
    console.log("Use the demo emails listed in the instructions.");
    console.log("======================================\n");
}

try {
    await seedTestData();
} catch (error) {
    console.error("\nTest data seeding failed:");
    console.error(error.message);
    process.exitCode = 1;
} finally {
    await mongoose.disconnect();
}

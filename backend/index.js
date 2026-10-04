import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { connectDB } from "./config/db.js";

import categoryRouter from "./routes/categoryRoutes.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cartRouter from "./routes/cartRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import orderRouter
    from "./routes/orderRoutes.js";dotenv.config();


const app = express();


// Middleware

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

app.use("/api/payments", paymentRouter);


// Routes

app.use("/api/users", userRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/orders",orderRouter);





// Test route

app.get("/", (req, res) => {

    res.json({
        message: "UniMart API is running"
    });

});


// Database

connectDB();


// Server

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `UniMart server is running on port ${PORT}`
    );

});
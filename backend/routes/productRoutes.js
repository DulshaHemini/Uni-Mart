import express from "express";

import {
    createProduct,
    getProductById,
    getProducts,
    getProductsBySeller,
    updateProduct,
    deleteProduct,
    getRecentlyPurchasedProducts
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/", createProduct);

productRouter.get("/", getProducts);

// Keep this static route BEFORE /:id
productRouter.get(
    "/recently-purchased",
    getRecentlyPurchasedProducts
);

productRouter.get("/seller/:sellerId", getProductsBySeller);

productRouter.put("/:id", updateProduct);

productRouter.delete("/:id", deleteProduct);

productRouter.get("/:id", getProductById);

export default productRouter;

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

import { authMiddleware } from "../middleware/authMiddleware.js";

const productRouter = express.Router();

// Public product browsing
productRouter.get("/", getProducts);
productRouter.get("/recently-purchased", getRecentlyPurchasedProducts);
productRouter.get("/seller/:sellerId", getProductsBySeller);
productRouter.get("/:id", getProductById);

// Only authenticated users can attempt product modifications.
// Controller checks that the user is a seller and owns the product.
productRouter.post("/", authMiddleware, createProduct);
productRouter.put("/:id", authMiddleware, updateProduct);
productRouter.delete("/:id", authMiddleware, deleteProduct);

export default productRouter;

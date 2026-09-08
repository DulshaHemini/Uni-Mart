import express from "express";

import {
    createProduct,
    getProductById,
    getProducts,
    getProductsBySeller,
    updateProduct,
    deleteProduct
} from "../controllers/productController.js";
import { get } from "mongoose";

const productRouter = express.Router();

productRouter.post("/", createProduct);

productRouter.get("/", getProducts);

productRouter.get("/seller/:sellerId",getProductsBySeller);

productRouter.put("/:id",updateProduct);

productRouter.delete("/:id",deleteProduct);

productRouter.get("/:id", getProductById);



export default productRouter;
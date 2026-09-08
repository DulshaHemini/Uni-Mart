import express from "express";

import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cartController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";


const cartRouter =
    express.Router();


// Every cart operation requires login
cartRouter.use(
    authMiddleware
);


// Add product
cartRouter.post(
    "/",
    addToCart
);


// Get logged-in user's cart
cartRouter.get(
    "/",
    getCart
);


// Update quantity
cartRouter.put(
    "/:cart_item_id",
    updateCartItem
);


// Remove one item
cartRouter.delete(
    "/item/:cart_item_id",
    removeCartItem
);


// Clear entire cart
cartRouter.delete(
    "/",
    clearCart
);


export default cartRouter;
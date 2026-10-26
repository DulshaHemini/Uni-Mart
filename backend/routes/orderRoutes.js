import express from "express";

import {
    createOrder,
    getOrderByCode,
    getMyOrders,
    getSellerOrders
} from "../controllers/orderController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";


const router =
    express.Router();


// CREATE ORDER

router.post(
    "/",
    authMiddleware,
    createOrder
);


// GET LOGGED-IN BUYER ORDERS
// MUST BE BEFORE /:orderCode

router.get(
    "/my-orders",
    authMiddleware,
    getMyOrders
);

// GET LOGGED-IN SELLER ORDERS

router.get(
    "/seller-orders",
    authMiddleware,
    getSellerOrders
);


// GET ORDER BY CODE
// KEEP THIS LAST

router.get(
    "/:orderCode",
    authMiddleware,
    getOrderByCode
);


export default router;
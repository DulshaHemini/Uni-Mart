import express from "express";

import {
    createOrder,
    getOrderByCode
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


// GET ORDER BY CODE

router.get(
    "/:orderCode",
    authMiddleware,
    getOrderByCode
);


export default router;
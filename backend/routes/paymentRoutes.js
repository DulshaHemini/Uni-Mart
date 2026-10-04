import express from "express";

import {
    generatePayHereHash,
    handlePayHereNotification
} from "../controllers/paymentController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";


const router = express.Router();


// ================================
// GENERATE PAYMENT HASH
// ================================

router.post(
    "/payhere/hash",
    authMiddleware,
    generatePayHereHash
);


// ================================
// PAYHERE NOTIFICATION
// ================================

router.post(
    "/payhere/notify",
    handlePayHereNotification
);


export default router;
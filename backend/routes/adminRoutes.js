import express from "express";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";

import {
    adminMiddleware
} from "../middleware/adminMiddleware.js";

import {
    getAdminDashboard,
    getAdminProducts,
    getAdminProductById,
    updateAdminProduct,
    updateProductStatus,
    getAdminInventory,
    updateProductStock,
    getAdminOrders,
    getAdminOrderById,
    updateAdminOrderStatus,
    getAdminUsers,
    updateUserBlockStatus
} from "../controllers/adminController.js";

const router = express.Router();


// ================================
// TEST ADMIN ACCESS
// ================================

router.get(
    "/test",
    authMiddleware,
    adminMiddleware,
    (req, res) => {

        return res.status(200).json({
            message: "Admin access granted",
            user: req.user
        });

    }
);


// ================================
// ADMIN DASHBOARD
// ================================

router.get(
    "/dashboard",
    authMiddleware,
    adminMiddleware,
    getAdminDashboard
);

// ========================================
// ADMIN PRODUCTS
// ========================================


router.get(
    "/products",
    authMiddleware,
    adminMiddleware,
    getAdminProducts
);

// ========================================
// ACTIVATE / DEACTIVATE PRODUCT
// ========================================

router.patch(
    "/products/:id/status",
    authMiddleware,
    adminMiddleware,
    updateProductStatus
);

// ========================================
// GET ONE PRODUCT
// ========================================

router.get(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    getAdminProductById
);


// ========================================
// UPDATE PRODUCT
// ========================================

router.put(
    "/products/:id",
    authMiddleware,
    adminMiddleware,
    updateAdminProduct
);

// ========================================
// INVENTORY
// ========================================

router.get(
    "/inventory",
    authMiddleware,
    adminMiddleware,
    getAdminInventory
);


// ========================================
// UPDATE STOCK
// ========================================

router.patch(
    "/inventory/:id/stock",
    authMiddleware,
    adminMiddleware,
    updateProductStock
);

// ========================================
// ADMIN ORDERS
// ========================================

router.get(
    "/orders",
    authMiddleware,
    adminMiddleware,
    getAdminOrders
);


// ========================================
// UPDATE ORDER STATUS
// ========================================

router.patch(
    "/orders/:id/status",
    authMiddleware,
    adminMiddleware,
    updateAdminOrderStatus
);

// ========================================
// GET ONE ORDER
// ========================================

router.get(
    "/orders/:id",
    authMiddleware,
    adminMiddleware,
    getAdminOrderById
);

// ========================================
// ADMIN USERS
// ========================================

router.get(
    "/users",
    authMiddleware,
    adminMiddleware,
    getAdminUsers
);


// ========================================
// BLOCK / UNBLOCK USER
// ========================================

router.patch(
    "/users/:id/block",
    authMiddleware,
    adminMiddleware,
    updateUserBlockStatus
);


export default router;
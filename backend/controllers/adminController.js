import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import OrderItem from "../models/OrderItem.js";
import Payment from "../models/Payment.js";

// ========================================
// GET ADMIN DASHBOARD DATA
// ========================================

export async function getAdminDashboard(req, res) {

    try {

        // --------------------------------
        // Dashboard Summary Counts
        // --------------------------------

        const totalProducts =
            await Product.countDocuments();

        const totalOrders =
            await Order.countDocuments();

        const totalUsers =
            await User.countDocuments();


        // We consider stock <= 5 as low stock
        const lowStock =
            await Product.countDocuments({
                stock_quantity: {
                    $lte: 5
                }
            });


        // --------------------------------
        // Recent Orders
        // --------------------------------

        const recentOrders =
            await Order.find()
                .populate(
                    "user_id",
                    "first_name last_name email"
                )
                .sort({
                    created_at: -1
                })
                .limit(5);


        // --------------------------------
        // Low Stock Products
        // --------------------------------

        const lowStockProducts =
            await Product.find({
                stock_quantity: {
                    $lte: 5
                }
            })
                .select(
                    "product_name stock_quantity category_id status"
                )
                .populate(
                    "category_id",
                    "category_name"
                )
                .sort({
                    stock_quantity: 1
                })
                .limit(5);


        // --------------------------------
        // Response
        // --------------------------------

        return res.status(200).json({

            message:
                "Admin dashboard data retrieved successfully",

            summary: {

                totalProducts,
                totalOrders,
                lowStock,
                totalUsers

            },

            recentOrders,

            lowStockProducts

        });

    }

    catch (error) {

        console.log(
            "Admin Dashboard Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to retrieve admin dashboard data",

            error:
                error.message

        });

    }

}

// ========================================
// GET ALL PRODUCTS FOR ADMIN
// ========================================

export async function getAdminProducts(req, res) {

    try {

        const search = req.query.search || "";
        const status = req.query.status || "";
        const category = req.query.category || "";

        const filter = {};


        // Search product name
        if (search) {

            filter.product_name = {
                $regex: search,
                $options: "i"
            };

        }


        // Filter by status
        if (status) {

            filter.status = status;

        }


        // Filter by category
        if (category) {

            filter.category_id = category;

        }


        const products = await Product.find(filter)

            .populate(
                "seller_id",
                "first_name last_name email"
            )

            .populate(
                "category_id",
                "category_name"
            )

            .sort({
                created_at: -1
            });


        return res.status(200).json({

            message:
                "Admin products retrieved successfully",

            products

        });

    } catch (error) {

        console.log(
            "Admin Products Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to retrieve products",

            error:
                error.message

        });

    }

}

// ========================================
// UPDATE PRODUCT STATUS
// ========================================

export async function updateProductStatus(req, res) {

    try {

        const { status } = req.body || {};

        if (!status) {

            return res.status(400).json({
                message: "Product status is required."
            });

        }

        if (
            status !== "active" &&
            status !== "inactive"
        ) {

            return res.status(400).json({
                message:
                    "Status must be active or inactive."
            });

        }

        const product =
            await Product.findById(
                req.params.id
            );

        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }

        product.status = status;

        await product.save();

        return res.status(200).json({

            message:
                `Product ${
                    status === "active"
                        ? "activated"
                        : "deactivated"
                } successfully.`,

            product

        });

    } catch (error) {

        console.log(
            "Update Product Status Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update product status.",

            error:
                error.message

        });

    }

}

// ========================================
// GET ONE PRODUCT FOR ADMIN
// ========================================

export async function getAdminProductById(req, res) {

    try {

        const product = await Product.findById(
            req.params.id
        )
            .populate(
                "seller_id",
                "first_name last_name email"
            )
            .populate(
                "category_id",
                "category_name"
            );


        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }


        return res.status(200).json({
            message:
                "Product retrieved successfully.",
            product
        });

    } catch (error) {

        console.log(
            "Admin Get Product Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve product.",
            error: error.message
        });

    }

}


// ========================================
// UPDATE PRODUCT FOR ADMIN
// ========================================

export async function updateAdminProduct(req, res) {

    try {

        const {
            product_name,
            description,
            category_id,
            price,
            condition,
            stock_quantity,
            image,
            status
        } = req.body;


        if (!product_name?.trim()) {

            return res.status(400).json({
                message:
                    "Product name is required."
            });

        }


        if (
            price === undefined ||
            Number(price) < 0
        ) {

            return res.status(400).json({
                message:
                    "Valid product price is required."
            });

        }


        if (
            stock_quantity === undefined ||
            Number(stock_quantity) < 0
        ) {

            return res.status(400).json({
                message:
                    "Valid stock quantity is required."
            });

        }


        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({
                message:
                    "Product not found."
            });

        }


        product.product_name =
            product_name.trim();

        product.description =
            description?.trim() || "";

        product.category_id =
            category_id;

        product.price =
            Number(price);

        product.condition =
            condition;

        product.stock_quantity =
            Number(stock_quantity);

        product.image =
            image?.trim() || "";

        if (
            status === "active" ||
            status === "inactive"
        ) {
            product.status = status;
        }


        await product.save();


        return res.status(200).json({

            message:
                "Product updated successfully.",

            product

        });

    } catch (error) {

        console.log(
            "Admin Update Product Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update product.",

            error:
                error.message

        });

    }

}

// ========================================
// GET INVENTORY
// ========================================

export async function getAdminInventory(req, res) {

    try {

        const products = await Product.find()
            .populate(
                "category_id",
                "category_name"
            )
            .select(
                "product_name category_id stock_quantity status"
            )
            .sort({
                stock_quantity: 1
            });


        return res.status(200).json({

            message:
                "Inventory retrieved successfully.",

            products

        });

    } catch (error) {

        console.log(
            "Admin Inventory Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to retrieve inventory.",

            error:
                error.message

        });

    }

}


// ========================================
// UPDATE PRODUCT STOCK
// ========================================

export async function updateProductStock(req, res) {

    try {

        const {
            stock_quantity
        } = req.body || {};


        if (
            stock_quantity === undefined ||
            Number(stock_quantity) < 0
        ) {

            return res.status(400).json({
                message:
                    "Valid stock quantity is required."
            });

        }


        const product =
            await Product.findById(
                req.params.id
            );


        if (!product) {

            return res.status(404).json({
                message:
                    "Product not found."
            });

        }


        product.stock_quantity =
            Number(stock_quantity);


        await product.save();


        return res.status(200).json({

            message:
                "Stock updated successfully.",

            product

        });

    } catch (error) {

        console.log(
            "Update Stock Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update stock.",

            error:
                error.message

        });

    }

}

// ========================================
// GET ALL ORDERS FOR ADMIN
// ========================================

export async function getAdminOrders(req, res) {

    try {

        const orders = await Order.find()
            .populate(
                "user_id",
                "first_name last_name email"
            )
            .sort({
                created_at: -1
            });


        return res.status(200).json({

            message:
                "Admin orders retrieved successfully.",

            orders

        });

    } catch (error) {

        console.log(
            "Admin Orders Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to retrieve orders.",

            error:
                error.message

        });

    }

}

// ========================================
// UPDATE ORDER STATUS
// ========================================

export async function updateAdminOrderStatus(req, res) {

    try {

        const {
            order_status
        } = req.body || {};


        const allowedStatuses = [
            "pending",
            "paid",
            "processing",
            "shipped",
            "completed",
            "cancelled",
            "failed"
        ];


        if (
            !allowedStatuses.includes(
                order_status
            )
        ) {

            return res.status(400).json({
                message:
                    "Invalid order status."
            });

        }


        const order =
            await Order.findById(
                req.params.id
            );


        if (!order) {

            return res.status(404).json({
                message:
                    "Order not found."
            });

        }


        order.order_status =
            order_status;


        await order.save();


        return res.status(200).json({

            message:
                "Order status updated successfully.",

            order

        });

    } catch (error) {

        console.log(
            "Update Order Status Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update order status.",

            error:
                error.message

        });

    }

}

// ========================================
// GET ORDER DETAILS FOR ADMIN
// ========================================

export async function getAdminOrderById(req, res) {

    try {

        const order = await Order.findById(
            req.params.id
        ).populate(
            "user_id",
            "first_name last_name email phone_number"
        );


        if (!order) {

            return res.status(404).json({
                message: "Order not found."
            });

        }


        const items = await OrderItem.find({
            order_id: order._id
        }).populate(
            "product_id",
            "product_name image"
        );


        const payment = await Payment.findOne({
            order_id: order._id
        });


        return res.status(200).json({

            message:
                "Order details retrieved successfully.",

            order,
            items,
            payment

        });

    } catch (error) {

        console.log(
            "Admin Order Details Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to retrieve order details.",

            error:
                error.message

        });

    }

}

// ========================================
// GET ALL USERS FOR ADMIN
// ========================================

export async function getAdminUsers(req, res) {

    try {

        const search = req.query.search || "";
        const role = req.query.role || "";

        const filter = {};


        // Search by name or email
        if (search) {

            filter.$or = [

                {
                    first_name: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    last_name: {
                        $regex: search,
                        $options: "i"
                    }
                },

                {
                    email: {
                        $regex: search,
                        $options: "i"
                    }
                }

            ];

        }


        // Filter by role
        if (role) {

            filter.role = role;

        }


        const users = await User.find(filter)
            .select("-password")
            .sort({
                created_at: -1
            });


        return res.status(200).json({

            message:
                "Admin users retrieved successfully.",

            users

        });

    } catch (error) {

        console.log(
            "Admin Users Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to retrieve users.",

            error:
                error.message

        });

    }

}


// ========================================
// BLOCK / UNBLOCK USER
// ========================================

export async function updateUserBlockStatus(req, res) {

    try {

        const {
            is_block
        } = req.body || {};


        if (typeof is_block !== "boolean") {

            return res.status(400).json({
                message:
                    "Valid block status is required."
            });

        }


        const user =
            await User.findById(
                req.params.id
            );


        if (!user) {

            return res.status(404).json({
                message:
                    "User not found."
            });

        }


        // Prevent admin from blocking own account
        if (
            user._id.toString() ===
            req.user.user_id.toString()
        ) {

            return res.status(400).json({
                message:
                    "You cannot block your own admin account."
            });

        }


        user.is_block = is_block;

        await user.save();


        return res.status(200).json({

            message:
                is_block
                    ? "User blocked successfully."
                    : "User unblocked successfully.",

            user: {

                user_id: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                role: user.role,
                is_block: user.is_block

            }

        });

    } catch (error) {

        console.log(
            "Admin User Block Error:",
            error
        );

        return res.status(500).json({

            message:
                "Failed to update user status.",

            error:
                error.message

        });

    }

}
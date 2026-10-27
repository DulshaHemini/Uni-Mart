import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";
import mongoose from "mongoose";

// Create Product



export async function createProduct(req, res) {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({
                message: "Only sellers can create products."
            });
        }

        const {
            product_name,
            description,
            price,
            condition,
            stock_quantity,
            category_id,
            image
        } = req.body;

        if (
            !product_name?.trim() ||
            !description?.trim() ||
            !category_id
        ) {
            return res.status(400).json({
                message: "Product name, description, and category are required."
            });
        }

        if (!mongoose.isValidObjectId(category_id)) {
            return res.status(400).json({
                message: "Invalid category ID."
            });
        }

        const parsedPrice = Number(price);
        const parsedStock = Number(stock_quantity);

        if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({
                message: "Price must be greater than zero."
            });
        }

        if (
            !Number.isInteger(parsedStock) ||
            parsedStock < 0
        ) {
            return res.status(400).json({
                message: "Stock quantity must be a non-negative integer."
            });
        }

        if (!["new", "used"].includes(condition)) {
            return res.status(400).json({
                message: "Condition must be either new or used."
            });
        }

        const product = await Product.create({
            seller_id: req.user.user_id,
            category_id,
            product_name: product_name.trim(),
            description: description.trim(),
            price: parsedPrice,
            condition,
            stock_quantity: parsedStock,
            image: image || "",
            status: "active"
        });

        return res.status(201).json({
            message: "Product created successfully.",
            product
        });
    } catch (error) {
        console.error("Create Product Error:", error);

        return res.status(500).json({
            message: "Failed to create product."
        });
    }
}




// Get Products + Search + Category Filter
export async function getProducts(req, res) {

    try {

        const search = req.query.search;
        const category = req.query.category;
        const sort = req.query.sort;


        // Filter
        let filter = {status: "active"};


        // Search
        if (search) {

            filter.$or = [
                {
                    product_name: {
                        $regex: search,
                        $options: "i"
                    }
                },
                {
                    description: {
                        $regex: search,
                        $options: "i"
                    }
                }
            ];

        }


        // Category Filter
        if (category) {

            filter.category_id = category;

        }


        // Sorting
        let sortOption = {
            created_at: -1
        };


        if (sort === "price_asc") {

            sortOption = {
                price: 1
            };

        }


        if (sort === "price_desc") {

            sortOption = {
                price: -1
            };

        }


        if (sort === "newest") {

            sortOption = {
                created_at: -1
            };

        }


        // Get products
        const products = await Product.find(filter)
            .populate(
                "seller_id",
                "first_name last_name image"
            )
            .populate(
                "category_id",
                "category_name"
            )
            .sort(sortOption);


        res.status(200).json({
            products: products
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get products",
            error: error.message
        });

    }

}

export async function getProductById(req, res) {

    try {

        if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
        message: "Invalid product ID."
    });
}

const product = await Product.findOne({
    _id: req.params.id,
    status: "active"
})
            .populate(
                "seller_id",
                "first_name last_name image"
            )
            .populate(
                "category_id",
                "category_name"
            );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.status(200).json({
            product: product
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to get product",
            error: error.message
        });

    }

}


export async function getProductsBySeller(req, res) {
    try {
        const products = await Product.find({
            seller_id: req.params.sellerId
        })
            .populate(
                "category_id",
                "category_name"
            )
            .sort({
                created_at: -1
            });

        res.status(200).json({
            products
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to get seller products",
            error: error.message
        });
    }
}



export async function updateProduct(req, res) {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({
                message: "Only sellers can update products."
            });
        }

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const allowedFields = [
            "product_name",
            "description",
            "category_id",
            "price",
            "condition",
            "stock_quantity",
            "image"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                message: "No valid product fields were provided."
            });
        }

        if (updates.product_name !== undefined) {
            if (
                typeof updates.product_name !== "string" ||
                !updates.product_name.trim()
            ) {
                return res.status(400).json({
                    message: "Product name cannot be empty."
                });
            }

            updates.product_name = updates.product_name.trim();
        }

        if (updates.description !== undefined) {
            if (
                typeof updates.description !== "string" ||
                !updates.description.trim()
            ) {
                return res.status(400).json({
                    message: "Description cannot be empty."
                });
            }

            updates.description = updates.description.trim();
        }

        if (updates.category_id !== undefined) {
            if (!mongoose.isValidObjectId(updates.category_id)) {
                return res.status(400).json({
                    message: "Invalid category ID."
                });
            }
        }

        if (updates.price !== undefined) {
            updates.price = Number(updates.price);

            if (!Number.isFinite(updates.price) || updates.price <= 0) {
                return res.status(400).json({
                    message: "Price must be greater than zero."
                });
            }
        }

        if (updates.condition !== undefined) {
            if (!["new", "used"].includes(updates.condition)) {
                return res.status(400).json({
                    message: "Condition must be new or used."
                });
            }
        }

        if (updates.stock_quantity !== undefined) {
            updates.stock_quantity = Number(updates.stock_quantity);

            if (
                !Number.isInteger(updates.stock_quantity) ||
                updates.stock_quantity < 0
            ) {
                return res.status(400).json({
                    message: "Stock must be a non-negative integer."
                });
            }
        }

        const product = await Product.findOneAndUpdate(
            {
                _id: id,
                seller_id: req.user.user_id,
                status: "active"
            },
            { $set: updates },
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Active product not found or you do not own this product."
            });
        }

        return res.status(200).json({
            message: "Product updated successfully.",
            product
        });
    } catch (error) {
        console.error("Update Product Error:", error);

        return res.status(500).json({
            message: "Failed to update product."
        });
    }
}




export async function deleteProduct(req, res) {
    try {
        if (req.user.role !== "seller") {
            return res.status(403).json({
                message: "Only sellers can deactivate products."
            });
        }

        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: "Invalid product ID."
            });
        }

        const product = await Product.findOne({
            _id: id,
            seller_id: req.user.user_id
        });

        if (!product) {
            return res.status(404).json({
                message: "Product not found or you do not own this product."
            });
        }

        if (product.status === "inactive") {
            return res.status(409).json({
                message: "This product is already inactive."
            });
        }

        product.status = "inactive";
        await product.save();

        return res.status(200).json({
            message: "Product deactivated successfully. It has not been permanently deleted.",
            product
        });
    } catch (error) {
        console.error("Deactivate Product Error:", error);

        return res.status(500).json({
            message: "Failed to deactivate product."
        });
    }
}



// Get recently purchased products from MongoDB
export async function getRecentlyPurchasedProducts(req, res) {
    try {
        const products = await OrderItem.aggregate([
            {
                $lookup: {
                    from: "orders",
                    localField: "order_id",
                    foreignField: "_id",
                    as: "order"
                }
            },
            { $unwind: "$order" },
            {
                $match: {
                    "order.order_status": {
                        $in: [
                            "paid",
                            "processing",
                            "shipped",
                            "completed"
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "product_id",
                    foreignField: "_id",
                    as: "product"
                }
            },
            { $unwind: "$product" },
            {
                $match: {
                    "product.status": "active"
                }
            },
            {
                $group: {
                    _id: "$product._id",
                    product_name: {
                        $first: "$product.product_name"
                    },
                    price: {
                        $first: "$product.price"
                    },
                    image: {
                        $first: "$product.image"
                    },
                    lastPurchasedAt: {
                        $max: "$order.created_at"
                    },
                    totalPurchased: {
                        $sum: "$quantity"
                    }
                }
            },
            { $sort: { lastPurchasedAt: -1 } },
            { $limit: 4 }
        ]);

        return res.status(200).json({ products });
    } catch (error) {
        console.error("Recently Purchased Error:", error);

        return res.status(500).json({
            message: "Failed to load recently purchased products"
        });
    }
}
import Product from "../models/Product.js";
import OrderItem from "../models/OrderItem.js";


// Create Product
export async function createProduct(req, res) {

    try {

        const product = new Product({
            seller_id: req.body.seller_id,
            category_id: req.body.category_id,
            product_name: req.body.product_name,
            description: req.body.description,
            price: req.body.price,
            condition: req.body.condition,
            stock_quantity: req.body.stock_quantity,
            image: req.body.image
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product: product
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to create product",
            error: error.message
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

        const product = await Product.findById(req.params.id)
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

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                product_name: req.body.product_name,
                description: req.body.description,
                category_id: req.body.category_id,
                price: req.body.price,
                condition: req.body.condition,
                stock_quantity:
                    req.body.stock_quantity,
                image: req.body.image
            },
            {
                new: true,
                runValidators: true
            }
        );


        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }


        res.status(200).json({
            message: "Product updated successfully.",
            product
        });


    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update product.",
            error: error.message
        });

    }

}

export async function deleteProduct(req, res) {

    try {

        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found."
            });
        }

        res.status(200).json({
            message: "Product deleted successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to delete product.",
            error: error.message
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
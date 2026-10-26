import Wishlist
    from "../models/Wishlist.js";

import Product
    from "../models/Product.js";


// ================================
// GET MY WISHLIST
// ================================

export const getWishlist =
    async (req, res) => {

    try {

        const userId =
            req.user.user_id;


        const wishlist =
            await Wishlist.find({
                user_id: userId
            })
                .populate({
                    path: "product_id",
                    populate: {
                        path: "category_id",
                        select: "category_name"
                    }
                })
                .sort({
                    createdAt: -1
                });


        return res.status(200).json({
            message:
                "Wishlist retrieved successfully",
            wishlist
        });


    } catch (error) {

        console.error(
            "Get Wishlist Error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to retrieve wishlist"
        });

    }

};


// ================================
// ADD PRODUCT TO WISHLIST
// ================================

export const addToWishlist =
    async (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const {
            product_id
        } = req.body;


        if (!product_id) {

            return res.status(400).json({
                message:
                    "Product ID is required."
            });

        }


        const product =
            await Product.findById(
                product_id
            );


        if (!product) {

            return res.status(404).json({
                message:
                    "Product not found."
            });

        }


        const existing =
            await Wishlist.findOne({
                user_id: userId,
                product_id
            });


        if (existing) {

            return res.status(409).json({
                message:
                    "Product already in wishlist."
            });

        }


        const wishlistItem =
            await Wishlist.create({
                user_id: userId,
                product_id
            });


        return res.status(201).json({
            message:
                "Product added to wishlist.",
            wishlistItem
        });


    } catch (error) {

        console.error(
            "Add Wishlist Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to add product to wishlist."
        });

    }

};


// ================================
// REMOVE FROM WISHLIST
// ================================

export const removeFromWishlist =
    async (req, res) => {

    try {

        const userId =
            req.user.user_id;

        const {
            productId
        } = req.params;


        const deleted =
            await Wishlist.findOneAndDelete({
                user_id: userId,
                product_id: productId
            });


        if (!deleted) {

            return res.status(404).json({
                message:
                    "Wishlist item not found."
            });

        }


        return res.status(200).json({
            message:
                "Product removed from wishlist."
        });


    } catch (error) {

        console.error(
            "Remove Wishlist Error:",
            error
        );


        return res.status(500).json({
            message:
                "Failed to remove product from wishlist."
        });

    }

};
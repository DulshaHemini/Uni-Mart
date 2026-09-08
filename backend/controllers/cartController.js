import Cart from "../models/Cart.js";
import CartItem from "../models/CartItem.js";
import Product from "../models/Product.js";


// =========================
// GET LOGGED USER ID
// =========================

function getUserId(req) {

    return (
        req.user?.user_id ||
        req.user?._id ||
        req.user?.id
    );

}


// =========================
// ADD TO CART
// =========================

export async function addToCart(req, res) {

    try {

        const user_id = getUserId(req);

        const {
            product_id,
            quantity = 1
        } = req.body;


        if (!user_id) {

            return res.status(401).json({
                message: "User information not found."
            });

        }


        if (!product_id) {

            return res.status(400).json({
                message: "Product ID is required."
            });

        }


        const requestedQuantity =
            Number(quantity);


        if (
            !Number.isInteger(requestedQuantity) ||
            requestedQuantity < 1
        ) {

            return res.status(400).json({
                message:
                    "Quantity must be at least 1."
            });

        }


        // Find product
        const product =
            await Product.findById(product_id);


        if (!product) {

            return res.status(404).json({
                message: "Product not found."
            });

        }


        if (product.status !== "active") {

            return res.status(400).json({
                message:
                    "This product is not available."
            });

        }


        if (product.stock_quantity < 1) {

            return res.status(400).json({
                message:
                    "This product is out of stock."
            });

        }


        if (
            requestedQuantity >
            product.stock_quantity
        ) {

            return res.status(400).json({
                message:
                    "Not enough stock available."
            });

        }


        // Find or create user's cart
        let cart = await Cart.findOne({
            user_id
        });


        if (!cart) {

            cart = await Cart.create({
                user_id
            });

        }


        // Check existing item
        let cartItem =
            await CartItem.findOne({
                cart_id: cart._id,
                product_id
            });


        if (cartItem) {

            const newQuantity =
                cartItem.quantity +
                requestedQuantity;


            if (
                newQuantity >
                product.stock_quantity
            ) {

                return res.status(400).json({
                    message:
                        "Not enough stock available."
                });

            }


            cartItem.quantity =
                newQuantity;

            await cartItem.save();

        } else {

            cartItem =
                await CartItem.create({
                    cart_id: cart._id,
                    product_id,
                    quantity:
                        requestedQuantity
                });

        }


        res.status(201).json({
            message:
                "Product added to cart successfully.",
            cartItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                "Failed to add product to cart.",
            error: error.message
        });

    }

}


// =========================
// GET CART
// =========================

export async function getCart(req, res) {

    try {

        const user_id = getUserId(req);


        if (!user_id) {

            return res.status(401).json({
                message:
                    "User information not found."
            });

        }


        const cart = await Cart.findOne({
            user_id
        });


        if (!cart) {

            return res.status(200).json({
                cart: null,
                items: [],
                item_count: 0,
                total: 0
            });

        }


        const cartItems =
            await CartItem.find({
                cart_id: cart._id
            })
                .populate(
                    "product_id",
                    [
                        "product_name",
                        "price",
                        "image",
                        "stock_quantity",
                        "status",
                        "condition"
                    ].join(" ")
                )
                .sort({
                    created_at: -1
                });


        // Ignore deleted products
        const validItems =
            cartItems.filter(
                (item) =>
                    item.product_id
            );


        // Total quantity for badge
        const itemCount =
            validItems.reduce(
                (total, item) =>
                    total + item.quantity,
                0
            );


        // Cart total
        const total =
            validItems.reduce(
                (sum, item) => {

                    return (
                        sum +
                        Number(
                            item.product_id.price
                        ) *
                        item.quantity
                    );

                },
                0
            );


        res.status(200).json({
            cart,
            items: validItems,
            item_count: itemCount,
            total
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                "Failed to get cart.",
            error: error.message
        });

    }

}


// =========================
// UPDATE QUANTITY
// =========================

export async function updateCartItem(
    req,
    res
) {

    try {

        const user_id = getUserId(req);

        const {
            cart_item_id
        } = req.params;

        const {
            quantity
        } = req.body;


        const newQuantity =
            Number(quantity);


        if (
            !Number.isInteger(newQuantity) ||
            newQuantity < 1
        ) {

            return res.status(400).json({
                message:
                    "Quantity must be at least 1."
            });

        }


        const cart =
            await Cart.findOne({
                user_id
            });


        if (!cart) {

            return res.status(404).json({
                message: "Cart not found."
            });

        }


        const cartItem =
            await CartItem.findOne({
                _id: cart_item_id,
                cart_id: cart._id
            });


        if (!cartItem) {

            return res.status(404).json({
                message:
                    "Cart item not found."
            });

        }


        const product =
            await Product.findById(
                cartItem.product_id
            );


        if (!product) {

            return res.status(404).json({
                message:
                    "Product not found."
            });

        }


        if (
            newQuantity >
            product.stock_quantity
        ) {

            return res.status(400).json({
                message:
                    "Not enough stock available."
            });

        }


        cartItem.quantity =
            newQuantity;

        await cartItem.save();


        res.status(200).json({
            message:
                "Cart quantity updated successfully.",
            cartItem
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                "Failed to update cart quantity.",
            error: error.message
        });

    }

}


// =========================
// REMOVE CART ITEM
// =========================

export async function removeCartItem(
    req,
    res
) {

    try {

        const user_id = getUserId(req);

        const {
            cart_item_id
        } = req.params;


        const cart =
            await Cart.findOne({
                user_id
            });


        if (!cart) {

            return res.status(404).json({
                message: "Cart not found."
            });

        }


        const cartItem =
            await CartItem.findOne({
                _id: cart_item_id,
                cart_id: cart._id
            });


        if (!cartItem) {

            return res.status(404).json({
                message:
                    "Cart item not found."
            });

        }


        await CartItem.findByIdAndDelete(
            cart_item_id
        );


        res.status(200).json({
            message:
                "Product removed from cart successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                "Failed to remove product from cart.",
            error: error.message
        });

    }

}


// =========================
// CLEAR CART
// =========================

export async function clearCart(req, res) {

    try {

        const user_id = getUserId(req);


        const cart =
            await Cart.findOne({
                user_id
            });


        if (!cart) {

            return res.status(200).json({
                message:
                    "Cart is already empty."
            });

        }


        await CartItem.deleteMany({
            cart_id: cart._id
        });


        res.status(200).json({
            message:
                "Cart cleared successfully."
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message:
                "Failed to clear cart.",
            error: error.message
        });

    }

}
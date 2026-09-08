import mongoose from "mongoose";

const cartItemSchema =
    new mongoose.Schema(
        {
            cart_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Cart",
                required: true
            },

            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },

            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        },
        {
            timestamps: {
                createdAt: "created_at",
                updatedAt: "updated_at"
            }
        }
    );


// Prevent the same product from appearing
// twice inside the same cart
cartItemSchema.index(
    {
        cart_id: 1,
        product_id: 1
    },
    {
        unique: true
    }
);


const CartItem = mongoose.model(
    "CartItem",
    cartItemSchema
);

export default CartItem;
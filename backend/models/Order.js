import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        order_code: {
            type: String,
            required: true,
            unique: true
        },

        shipping_address: {
            type: String,
            required: true
        },

        shipping_city: {
            type: String,
            required: true
        },

        shipping_postal_code: {
            type: String,
            required: true
        },

        billing_address: {
            type: String,
            required: true
        },

        billing_city: {
            type: String,
            required: true
        },

        billing_postal_code: {
            type: String,
            required: true
        },

        phone_number: {
            type: String,
            required: true
        },

        total_amount: {
            type: Number,
            required: true
        },

        order_status: {
            type: String,
            enum: [
                "pending",
                "paid",
                "cancelled",
                "failed"
            ],
            default: "pending"
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default mongoose.model("Order", orderSchema);
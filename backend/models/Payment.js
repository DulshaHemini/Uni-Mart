import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
    {
        order_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true
        },

        payment_method: {
            type: String,
            default: "PayHere"
        },

        payment_status: {
            type: String,
            enum: [
                "pending",
                "success",
                "cancelled",
                "failed",
                "chargedback"
            ],
            default: "pending"
        },

        amount: {
            type: Number,
            required: true
        },

        payhere_payment_id: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

export default mongoose.model(
    "Payment",
    paymentSchema
);
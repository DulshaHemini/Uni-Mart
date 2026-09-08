import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        first_name: {
            type: String,
            required: true,
            trim: true
        },

        last_name: {
            type: String,
            required: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        phone_number: {
            type: String,
            required: true,
            trim: true
        },

        role: {
            type: String,
            enum: ["buyer", "seller", "admin"],
            default: "buyer"
        },

        image: {
            type: String,
            default: ""
        },

        is_block: {
            type: Boolean,
            default: false
        },

        is_email_verified: {
            type: Boolean,
            default: false
        }
    },

    {
        timestamps: {
            createdAt: "created_at",
            updatedAt: "updated_at"
        }
    }
);

const User = mongoose.model("User", userSchema);

export default User;
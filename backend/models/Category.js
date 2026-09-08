import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        }
    }
);

const Category = mongoose.model(
    "Category",
    categorySchema
);

export default Category;
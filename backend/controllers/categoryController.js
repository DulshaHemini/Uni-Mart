import Category from "../models/Category.js";


// Create Category

export async function createCategory(req, res) {

    try {

        const {
            category_name,
            description
        } = req.body;


        const category = new Category({

            category_name: category_name,

            description: description

        });


        await category.save();


        res.status(201).json({

            message: "Category created successfully",

            category: category

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to create category",

            error: error.message

        });

    }
}

// Get all categories

export async function getCategories(req, res) {

    try {

        const categories = await Category.find();

        res.status(200).json({

            categories: categories

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to get categories",

            error: error.message

        });

    }
}
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";


// ================================
// Register User
// ================================

export async function createUser(req, res) {

    try {

        const email = req.body.email.trim().toLowerCase();
        const first_name = req.body.first_name.trim();
        const last_name = req.body.last_name.trim();
        const password = req.body.password;
        const phone_number = req.body.phone_number.trim();


        // Check whether email already exists

        const existingUser = await User.findOne({
            email: email
        });


        if (existingUser) {

            return res.status(400).json({
                message: "User already exists. Please log in to your account."
            });

        }


        // Hash password

        const hashedPassword = await bcrypt.hash(
            password,
            10
        );


        // Create new user

        const user = new User({

            email: email,

            first_name: first_name,

            last_name: last_name,

            password: hashedPassword,

            phone_number: phone_number

        });


        // Save user to MongoDB

        await user.save();


        res.status(201).json({

            message: "User registered successfully"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Registration failed",

            error: error.message

        });

    }

}


// ================================
// Login User
// ================================

export async function loginUser(req, res) {

    try {

        const email = req.body.email.trim().toLowerCase();
        const password = req.body.password;

        // Find user by email

        const user = await User.findOne({
            email: email
        });


        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }

        // Check whether user is blocked

        if (user.is_block) {

            return res.status(403).json({

                message: "Your account has been blocked. Please contact the administrator."

            });

        }


        // Check password

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );


        if (!passwordMatch) {

            return res.status(401).json({

                message: "Incorrect password"

            });

        }


        // Create JWT

        const token = jsonwebtoken.sign(

            {
                user_id: user._id,

                email: user.email,

                first_name: user.first_name,

                last_name: user.last_name,

                role: user.role,

                is_block: user.is_block,

                is_email_verified: user.is_email_verified
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "1d"
            }

        );


        res.json({

            message: "Login successful",

            token: token,

            user: {

                user_id: user._id,

                email: user.email,

                first_name: user.first_name,

                last_name: user.last_name,

                role: user.role

            }

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Login failed",

            error: error.message

        });

    }

}
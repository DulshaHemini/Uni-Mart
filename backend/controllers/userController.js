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

                message: "Invalid email or password"
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

                message: "Invalid email or password"

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

// ================================
// Get User Profile
// ================================

export async function getUserProfile(req, res) {
    try {
        const user = await User.findById(
            req.user.user_id
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }

        res.status(200).json({
            message: "Profile retrieved successfully",
            user
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to retrieve profile"
        });
    }
}

// ================================
// Update User Profile
// ================================

export async function updateUserProfile(req, res) {
    try {
        const {
            first_name,
            last_name,
            phone_number,
            shipping_address,
            billing_address
        } = req.body;

        const user = await User.findById(
            req.user.user_id
        );

        if (!user) {
            return res.status(404).json({
                message: "User profile not found"
            });
        }

        if (first_name !== undefined) {
            user.first_name = first_name.trim();
        }

        if (last_name !== undefined) {
            user.last_name = last_name.trim();
        }

        if (phone_number !== undefined) {
            user.phone_number = phone_number.trim();
        }

        if (shipping_address !== undefined) {
            user.shipping_address = shipping_address.trim();
        }

        if (billing_address !== undefined) {
            user.billing_address = billing_address.trim();
        }

        await user.save();

        const updatedUser = await User.findById(
            user._id
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update profile"
        });
    }
}

// ================================
// Change Password
// ================================

export async function changePassword(req, res) {
    try {
        const {
            current_password,
            new_password
        } = req.body;

        if (!current_password || !new_password) {
            return res.status(400).json({
                message: "Current password and new password are required"
            });
        }

        const user = await User.findById(
            req.user.user_id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const passwordMatch = await bcrypt.compare(
            current_password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Current password is incorrect"
            });
        }

        if (new_password.length < 8) {
            return res.status(400).json({
                message: "New password must contain at least 8 characters"
            });
        }

        const samePassword = await bcrypt.compare(
            new_password,
            user.password
        );

        if (samePassword) {
            return res.status(400).json({
                message: "New password must be different from the current password"
            });
        }

        user.password = await bcrypt.hash(
            new_password,
            10
        );

        await user.save();

        res.status(200).json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to change password"
        });
    }
}
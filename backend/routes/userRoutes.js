import express from "express";

import {
    createUser,
    loginUser
} from "../controllers/userController.js";

import {
    authMiddleware
} from "../middleware/authMiddleware.js";


const userRouter = express.Router();


userRouter.post(
    "/register",
    createUser
);


userRouter.post(
    "/login",
    loginUser
);


userRouter.get(
    "/profile",
    authMiddleware,
    (req, res) => {

        res.json({

            message: "Profile accessed successfully",

            user: req.user

        });

    }
);


export default userRouter;
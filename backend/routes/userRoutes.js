import express from "express";

import {
    createUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
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
    getUserProfile
);

userRouter.put(
    "/profile",
    authMiddleware,
    updateUserProfile
);

userRouter.put(
    "/change-password",
    authMiddleware,
    changePassword
);

export default userRouter;
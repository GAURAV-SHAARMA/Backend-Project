import { Router } from "express";
import { registerUser , loginUser , logoutUser } from "../controllers/user.controller.js"; 
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name : "avatar", // this name will refect on frontend
            maxCount : 1
        },
        {
            name: "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)
//secured route

router.route("/logout").post(verifyJWT, logoutUser)//verifyJWT->> to check if user is authenticated or not then only allow to logout

export default router
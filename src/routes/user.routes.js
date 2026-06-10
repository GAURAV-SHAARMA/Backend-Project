import { Router } from "express";
import { registerUser , loginUser , logoutUser,refreshAccesstoken } from "../controllers/user.controller.js"; 
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

router.route("/refresh-token").post(refreshAccesstoken) // this route is public because when access token expires then user will not be able to access any protected route then how will he get new access token so this route should be public but we will verify the refresh token in controller

export default router
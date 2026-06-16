import { Router } from "express";
import { registerUser ,
    loginUser ,
    logoutUser,
    refreshAccesstoken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUsercoverImage, getUserChannelProfile, getWatchHistory } from "../controllers/user.controller.js"; 
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


router.route("/change-password").post(verifyJWT , changeCurrentPassword)


router.route("/current-user").post(verifyJWT , getCurrentUser )

router.route("/update-Account").patch(verifyJWT , updateAccountDetails) // we dont need complete change so we use  ( patch )


router.route("/avatar").patch(verifyJWT , upload.single("avatar") , updateUserAvatar)

router.route("/cover-image").patch(verifyJWT , upload.single("coverImage") , updateUsercoverImage)


router.route("/c/c:username").get(verifyJWT , getUserChannelProfile)


router.route("/history").get(verifyJWT , getWatchHistory)

export default router


import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/User.model.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    //    res.status(200).json({
    //         message: "ok"

    // get user details from frontend or we can say postman 
    //validation->> not empty(main)
    //check if user already exist or not ->> through email and username
    //check for images and Avatar ->> if exist uplaod them on cloudinary and get the url
    //user ne diya ->> multer ne uplaod kiya ya nhi then at last cloudinary per upload huva ya nhi 


    // create user Object ->> entry in database ( for mongoDB)
    // remove passwoerd and referesh token from the response
    // check for user creation
    // return response



    //1 . user details

    const { fullName, email, username, password } = req.body
    console.log("email", email);// check if workig or not (chedcked)

    // now to routes->>>


    // // validations ->>>
    // one method->

    // if(fullName == "" || email == "" || username == "" || password == ""){
    //     throw new ApiError("All fields are required" , 400)
    // }

    // second method

    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError("All fields are required", 400)
    }


    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser) {
        throw new ApiError("User already exist with this email or username", 409)
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverimageLocalpath = req.files?.coverImage[0]?.path;

    // now we have the path of the images in our local storage but we need to upload them on cloudinary and get the url and then save it in the database

    if (!avatarLocalPath) {
        throw new ApiError("Avatar is Required", 400)
    }

    // uplaod to cloudinary

    const avatar = await uploadToCloudinary(avatarLocalPath);
    const coverImage = await uploadToCloudinary(coverimageLocalpath)

    if (!avatar) {
        throw new ApiError("Error in uploading avatar to cloudinary", 500)
    }

    // create user object ->> entry to db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url.toString() || "",
        email,
        password,
        username : username.toLowerCase()
    })

    const createdUser = await User.findById(
        user._id
    ).select("-password -refreshtoken") 

    if(!createdUser){
        throw new ApiError("Error in creating user", 500)
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

export { registerUser }
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

import { User } from "../models/User.model.js";

import { uploadToCloudinary } from "../utils/cloudinary.js";

import { ApiResponse } from "../utils/ApiResponse.js";

import jwt from "jsonwebtoken";

// for easy access and to avoid code repetition we will create a function to generate access token and refresh token
const generateAccessAndRefreshToken = async(userId) => {
    try{
 
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        
        user.refreshtoken = refreshToken;// to save refresh token on database for future use when user will send request for new access token with refresh token then we will match the refresh token with the one stored in database if match then we will generate new access token and refresh token and send it to user and also update the refresh token in database
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }

    }     catch(err){
        throw new ApiError("Error in generating access token and refresh token", 500)
    }
}

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
    console.log(req.files); // check if files are coming or not (checked)

    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverimageLocalpath = req.files?.coverImage[0]?.path;

    let coverimageLocalpath ;// to check when cover image request is not sent by user then it will be null and we can handle it in cloudinary upload function
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverimageLocalpath = req.files.coverImage[0].path;
    }

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

// login system

const loginUser = asyncHandler(async (req, res) => {
    // req body-> data
    // username or email or bothg
    // find the user
    //password check
    // access token and refresh token generate
    // send cookies
    // response

        const { username, email, password } = req.body
        if(!(username || email)){
            console.log("Body:", req.body);
            throw new ApiError("Username or email is required", 400)
        }

        const user = await User.findOne({
            $or : [{username}, {email}]  // ager dono username aur email diye gaye to dono me se koi bhi match kar jaye to user mil jayega
        })

        if(!user){
            throw new ApiError("User not found with this email or username", 404)
        }

        const isPasswordValid = await user.isPasswordCorrect(password)

        if(!isPasswordValid){
            throw new ApiError("Invalid password", 401)
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

        const loggedInUser = await User.findById(user._Id).select("-password -refreshtoken")// optional

        // cookies ->> httpOnly, secure, sameSite, maxAge
        //cookies-> cookies are small text files that are stored on the client side and sent to the server with every request. They are used to store user preferences, session information, and other data that needs to be persisted across requests.
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                { 
                    user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully")
        )
})

// logout system ->> delete cookies and also delete refresh token from database

const logoutUser = asyncHandler(async (req, res) => {
    // delete cookies
    // delete refresh token from database
    await User.findByIdAndUpdate(
        req.user._id, 
        { 
            refreshtoken: undefined
        }, 
        { 
            new: true 
        })// to delete refresh token from database and also to check if user exist or not with the help of
    
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(
            new ApiResponse(
                200, 
                null,
                "User logged out successfully")
        )
})


const refreshAccesstoken = asyncHandler(async(req , res)=>{
    const incomingRefreshToken = re.cookies.refreshToken || re.body.refreshToken;

    if(!incomingRefreshToken){
        throw new ApiError("Refresh token is required", 400)
    }

    try{

        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
    )

        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError("invalid refresh token", 404)
        }

        if(incomingRefreshToken !== user.refreshtoken){
            throw new ApiError("Invalid refresh token", 401)
        }

        const { accessToken, newrefreshToken } = await generateAccessAndRefreshToken(user._id)
        const options = {
            httpOnly: true,
            secure: true
        }

        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newrefreshToken, options)
        .json(
            new ApiResponse(
                200, 
                { 
                    accessToken, newrefreshToken
                },
                "Access token refreshed successfully")
            )
        } catch(error){
            throw new ApiError("Invalid refresh token",error?.message, 401)
        }

})


export { 
    registerUser, 
    loginUser ,
    logoutUser,
    refreshAccesstoken
}

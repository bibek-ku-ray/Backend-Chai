import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const {fullName, email, username, password} = req.body;
    console.log(email);

    // validate - not empty
    if(
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400, "All field are required")
    }

    // check the user exist → username, email
    const existedUser = await User.findOne({
        $or: [{ email }, { username }]
    })

    if(existedUser){
        throw new ApiError(409, "email or username already exits.")
    }

    // check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path

    /*

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length() > 0){
     coverImageLocalPath = req.files.coverImage[0].path
    }
    */
    // console.log('req.file:: ',req.files);

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required")
    }

    // check upload them cloudinary -> avatar, coverImage
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar is required")
    }

    // create user object → create entry in db
    const user = await User.create({
         fullName,
         avatar: avatar.url,
         coverImage: coverImage?.url || "",
         email,
         password,
         username: username.toLowerCase()
    })

    // remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500, "Something went wrong while creating user")
    }

    // return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User created successfully")
    )
})

export { registerUser}
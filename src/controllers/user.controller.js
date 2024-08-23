import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js"
import {ApiErrors} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { refreshTokenAndAccessToken } from "../utils/refreshTokenAndAccessToken.js"
import {cloudinaryFileUplodad} from "../middleware/cloudinary.middleware.js"
import jwt from "jsonwebtoken"

const registerUser=asyncHandler( async (req,res)=>{
    // main traget is save all information in mongodb and save files in cloudinary
    // now write steps
    // i have checked all information shouldn't be empty
    //console.log(req.files)
    const {fullname, email, username, password } = req.body
    if([fullname,email,username,password].some((details)=> details?.trim()==="")){
      throw new ApiErrors(400,"Please fill the all credentials!!")
    }

    //validation of user by their username and email ID

    const user=await User.findOne({
        $or:[{ username },{ email }]
    })
    
    if(user){
        throw new ApiErrors(400,"user is already exist!! ")
    }
    //console.log(req.files)
    const avatarlocalPath=(req.files?.avatar[0]?.path)

    // coverImagelocalPath=(req.files?.coverImage[0]?.path)
    // loacatpath for both avatar and coverImage, upload them on cloudinary
    let coverImagelocatPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
        coverImagelocatPath=req.files.coverImage[0].path
    }
    if(!avatarlocalPath){
        throw new ApiErrors(400,"avatar is missing  !! ")
    }

    const avatarRespose=await cloudinaryFileUplodad(avatarlocalPath) 
    const coverImageRespose=await cloudinaryFileUplodad(coverImagelocatPath)

    const userDetailsMongodb=await User.create(
        {
            username,
            email,
            password,
            fullname,
            watchHistory:[],
            avatar:avatarRespose.url,
            coverImage:coverImageRespose?.url||"",
            refreshToken:""

        }
    )
    const removePassAndRef_Token=await User.findById(userDetailsMongodb._id).select(
        "-password -refreshToken"
    )

    if (!removePassAndRef_Token) {
        throw new ApiErrors(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, removePassAndRef_Token, "User registered Successfully")
    )
})
const logInUser=asyncHandler(async (req,res)=>{
    // req.body->data
    //check username,email,password
    //validate for username or email
    // match password
    // Generate refreshToken and accessToken
    // give cookies
    const {username,email,password}=req.body
    if(!(username || email)){
        throw new ApiErrors(400,"Please Enter the email Or username")
    }
    const user=await User.findOne(
        {
            $or:[{ username },{ email }]
        }
    )

    const isPassword=await user.isPasswordCorrect(password)

    if(!isPassword){
        throw new ApiErrors(401,"Please Enter Correct Password")
    }

    const {refreshToken,accessToken}=await refreshTokenAndAccessToken(user._id)

    const loggedInUser=await User.findById(user._id).select(
        "-password -refreshToken"
    )
    const options={
        httpOnly:true,
        secure:true
    }
    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,refreshToken,accessToken
            },
            "User successfully loggedIn!!"
        )
    )
})
const logOutUser=asyncHandler(async (req,res)=>{
    const user=await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
       )

       const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))

})
const generateReFreshToken=asyncHandler(async(req,res)=>{
    // console.log(req.cookies)
    const reqRefreshToken=req.cookies?.refreshToken

    if(!reqRefreshToken){
        throw new Error(401,"You are not logIn!")
    }
    const decodedRefreshToken=jwt.verify(reqRefreshToken,process.env.refresh_WebToken_Secure)

    const user=await User.findById(decodedRefreshToken._id)

    if(!user){
        throw new ApiErrors(401,"you don't have User inFormation")
    }
    const {refreshToken,accessToken}=await refreshTokenAndAccessToken(user._id)
    const options={
        httpOnly:true,
        secure:true
    }
    console.log(refreshToken)
    res
    .cookie("newrefreshToken",refreshToken,options)
    .json({
        newfreshToken:refreshToken,
        newaccessToken:accessToken,
        message:"refresh and access Token are Generated!"
    })
})
const passwordUpdate=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword}=req.body
    const user=await User.findById(req.user._id)
    if(!user){
        throw new ApiErrors(400,"You don't have User, So you can't update password!")
    }
    const isCorrectPassword=await user.isPasswordCorrect(oldPassword)
    if(!isCorrectPassword){
        throw new ApiErrors(400,"Please Enter Correct Password!!")
    }
   // console.log(user.password)
    user.password=newPassword    
    await user.save({validateBeforeSave:true})
    
    res
    .status(400)
    .json(
        {
            User:user,
            message:"password Succesfully Updated!"
        }
    )
})
const getCurrentUser=asyncHandler(async(req,res)=>{
    //steps for get Current User information
    const user=req.user
    res
    .status(400)
    .json( 
        {
            User_information :user
        }
    )
})
const updateAccountDetails=asyncHandler(async(req,res)=>{
    //steps--> {username,email,fullname}
    //console.log(req.body)
    const {username,email,fullname}=req.body
    if(!(username||email||fullname)){
        throw new ApiErrors(401,"Please Enter atleast one out of email,username And fullname")
    }
    if(username){
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    username
                }
            },
            {
                new:true
            }
        )
    }
    if(email){
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    email
                }
            },
            {
                new:true
            }
        )
    }
    if(fullname){
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $set:{
                    fullname
                }
            },
            {
                new:true
            }
        )
    }
    const newUser=await User.findById(req.user._id).select("-password")
    res.json(newUser)
})
const updateUserAvatar=asyncHandler(async(req,res)=>{
    //steps for updateUserAvatar
    // req.user
    const user=req.user
    if(!user){
        throw new ApiErrors(401,"Unauthorized Request!")
    }
    console.log(req.file)
    const avatarlocalPath=req.file?.path
    console.log(avatarlocalPath)
    if(!avatarlocalPath){
        throw new ApiErrors(401,"File path doesn't exist in local Path!")
    }
    const avatarCloudinaryResponse=await cloudinaryFileUplodad(avatarlocalPath)

    if(!avatarCloudinaryResponse){
        throw new ApiErrors(500,"Error while uploading at cloudinary!")
    }
   
    const oldURLCloudinary=await User.findById(req.user._id)

    console.log(oldURLCloudinary.avatar)

  
    const usernew=await User.findByIdAndUpdate(
     req.user._id,
   
     {
   
         $set:{
   
             avatar:avatarCloudinaryResponse.url
   
         }
   
     },
   
     {
   
         new:true
   
     }
   
     ).select("-password")
   


   
     res.json(
   
     {
   
            msg:"Yes i am listening! ",
            user:usernew
   
         }
   
         )


    
})
const updateUsercoverImage=asyncHandler(async(req,res)=>{
    //steps for updateUserAvatar
    // req.user
    const user=req.user
    if(!user){
        throw new ApiErrors(401,"Unauthorized Request!")
    }
    console.log(req.file)
    const coverImagelocalPath=req.file?.path
    if(!coverImagelocalPath){
        throw new ApiErrors(401,"File path doesn't exist in local Path!")
    }
    const coverImageCloudinaryResponse=await cloudinaryFileUplodad(coverImagelocalPath)

    if(!coverImageCloudinaryResponse){
        throw new ApiErrors(500,"Error while uploading at cloudinary!")
    }
   
    const oldURLCloudinary=await User.findById(req.user._id)

    console.log(oldURLCloudinary.avatar)

  
    const usernew=await User.findByIdAndUpdate(
     req.user._id,
   
     {
   
         $set:{
   
             coverImage:coverImageCloudinaryResponse.url
   
         }
   
     },
   
     {
   
         new:true
   
     }
   
     ).select("-password")
   


   
     res.json(
   
     {
   
            msg:"Yes i am listening! ",
            user:usernew
   
         }
   
         )
    
})
const getUserChannelProfile=asyncHandler(async(req,res)=>{
    //console.log(req.params)
    const {username}=req.params
    //console.log(username)
    if(!username?.trim()){
        throw new ApiErrors(400,"Please give Username! ")
    }
    const channel=await User.aggregate(
        [
            {
                $match:{
                    username:username
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"channel",
                    as:"subscriber"
                }
            },
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"_id",
                    foreignField:"subsciber",
                    as:"subscribedTo"
                }
            },
            {
                $addFields: {
                    countsubscriber: { $size: "$subscriber" },
                    countsubscribed: { $size: "$subscribedTo" }
                }
            },
            // {
            //     $project:{
            //         username:1,
            //         fullname:1,
            //         avatar:1,
            //         countsubscriber:1,
            //         countsubscribed:1,
            //         coverImage:1
            //     }
            // }
        ]
    )
    if(!channel?.length){
        throw new ApiErrors(400,"you don't have Channel")
    }
    res
    .status(400)
    .json(
         new ApiResponse(
            400,
            {
                "channel":channel
            },
            {
                message:"you have channel"
            }
         )
    )
})
const getWatchHistory=asyncHandler(async(req,res)=>{
    const watchHistory=await User.aggregate(
        [
            {
                $match:{
                    _id: new mongoose.ObjectId(req.user._id)
                }
            },
            {
                $lookup:{
                    from:"videos",
                    localField:"watchHistory",
                    foreignField:"_id",
                    as:"watchHistory",
                    pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner",
                            pipeline:[
                                {
                                    $project:{
                                        username:1,
                                        fullname:1,
                                        avatar:1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields:{
                            owner:{
                                $first:"$owner"
                            }
                        }
                    }
                    ]
                }
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(400,
            watchHistory,
        "successfully get History"
        )
    )
})
export {
    registerUser,
    logInUser,
    logOutUser,
    generateReFreshToken,
    passwordUpdate,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUsercoverImage,
    getUserChannelProfile,
    getWatchHistory
}
import User from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiError.js";
//import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"

const verifyJWT=async (req,_,next)=>{
    // encoded accessToken
   // console.log(req.cookies)
   //console.log("hello")
    try {
       // console.log("i am at verifyJWT")
        const accessToken= req.cookies?.accessToken||req.header("Authorization")?.replace("Bearer ","")
        if(!accessToken){
            throw new ApiErrors(401,"Unauthorized request||please logIn first")
        }
        //decode the accessToken
        const decodedToken= jwt.verify(accessToken,process.env.access_WebToken_Secure)
    
        const user=await User.findById(decodedToken._id)?.select("-password -refreshToken")
        if(!user){
            throw new ApiErrors(401,"Invalid Access Token")
        }
        req.user=user
    } catch (error) {
       console.log("please loggIn first")
    }
    next()
}
export {verifyJWT}
import User from "../models/user.model.js"
import { ApiErrors } from "./ApiError.js"
const refreshTokenAndAccessToken= async(user_id)=>{
    try {
        const user=await User.findById(user_id)

        const refreshToken=await user.generaterefreshToken()
        const accessToken=await user.generateAccessToken()
        
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {refreshToken,accessToken}

    } catch (error) {
        throw new ApiErrors(500,"Server Error while Generating Tokens!!",error)
    }
}

export {refreshTokenAndAccessToken}
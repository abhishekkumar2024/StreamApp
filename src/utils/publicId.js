import { ApiErrors } from "./ApiError.js";

const publicId=function extractPublicId(cloudinaryUrl) {
    if(!cloudinaryUrl?.trim()){
        throw new ApiErrors(400,"you don't have a valid Cloudinary_URL!")
    }
    let idx=cloudinaryUrl.length
    idx=idx-5;
    let Public_Id=""
    while(idx!=0 && cloudinaryUrl[idx]!='/'){
        Public_Id=cloudinaryUrl[idx]+Public_Id
        idx--;
    }
    return Public_Id
}
export {publicId}
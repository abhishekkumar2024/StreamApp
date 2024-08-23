import {v2 as cloudinary} from "cloudinary"
import fs from "fs"
import { ApiErrors } from "../utils/ApiError.js";

  cloudinary.config({ 
    cloud_name: process.env.cloud_name, 
    api_key: process.env.api_key, 
    api_secret: process.env.api_secret 
  });

  const cloudinaryFileUplodad= async (cloudinary_Path)=>{
    try {
         if (!cloudinary_Path) return null
        //console.log(cloudinary_Path,typeof cloudinary_Path)
        console.log(cloudinary_Path)
        console.log(typeof cloudinary_Path)
        const response=await cloudinary.uploader.upload(cloudinary_Path,{
            resource_type:"auto"
        })
        if(response){ 
            console.log(`File is succesfully Aploaded at cloudinary!! URL is : ${response.url}`)
        }
        fs.unlinkSync(cloudinary_Path,()=>{
          console.log(`file has been successfully removed from ${cloudinary_Path}`)
        })
        return response
    } catch (error) {
        fs.unlinkSync(cloudinary_Path,()=>{
            console.log('File has removed from temp!');
        })
        console.log(`\n error : ${error}`)
        return null
    }
  }
  const cloudinaryDeleteFile=async(videoPublicId)=>{
    cloudinary.api.delete_resources([videoPublicId], 
      { type: 'upload', resource_type: 'video' })
    .then(console.log('video is successfully deleted')).catch((error)=>{
      console.log(error)
    });
  }
  const cloudinaryDeletePhoto=async(videoPublicId)=>{
    cloudinary.api.delete_resources([videoPublicId], 
      { type: 'upload', resource_type: 'image' })
    .then(console.log('photo is successfully deleted')).catch((error)=>{
      console.log(error)
    });
  }
  
  export {
    cloudinaryFileUplodad,
    cloudinaryDeleteFile,
    cloudinaryDeletePhoto
  }  
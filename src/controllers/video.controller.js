import { ApiErrors } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { cloudinaryDeletePhoto, cloudinaryFileUplodad } from "../middleware/cloudinary.middleware.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { Video } from "../models/video.model.js"
import mongoose from 'mongoose'
import { cloudinaryDeleteFile } from "../middleware/cloudinary.middleware.js"
import { publicId } from "../utils/publicId.js"

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
    const sortStatus=1
    if(sortType=="desc"){
        sortStatus=-1
    }
    const userInfo=await Video.aggregate(
        [
            {
                $match:{
                   $and:[{owner:userId},{title:query}] 
                }
            },
            {
                $sort:{
                    [sortBy]:sortStatus
                }  
            },
            {
                $skip:(page-1)*limit
            },
            {
                $limit:limit
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userInfo,
            "yess all published videos"
        )
    )
})
const publishAVideo = asyncHandler(async (req, res) => {
    const userId=req.user._id
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const isTitleExist=await Video.findOne({title})
    if(isTitleExist){
        throw new ApiErrors(400,"please Enter another Title!")
    }
    const userFiles=req.files
    if(!userFiles){
        throw new ApiErrors(400,"please give required Files!")
    }
    const localPathVideoFile=userFiles.videoFile[0].path

    if(!localPathVideoFile){
        throw new ApiErrors(400,"Please upload video")
    }
    const localPaththumbnail=userFiles.thumbnail[0].path
    if(!localPaththumbnail){
        throw new ApiErrors(400,"Please upload valid Thumbnail!")
    }

    const cloudinaryVideoFile=await cloudinaryFileUplodad(localPathVideoFile)
    if(!cloudinaryVideoFile){
        throw new ApiErrors(500,"Video is not aploaded at cloudinary!")
    }
    const cloudinaryThumbnailFile=await cloudinaryFileUplodad(localPaththumbnail)
    if(!cloudinaryThumbnailFile){
        throw new ApiErrors(500,"thumbnail is not uploaded at cloudinary!")
    }
    const duration=cloudinaryVideoFile.duration
    const videoFile=cloudinaryVideoFile.url
    const thumbnail=cloudinaryThumbnailFile.url
    const videoInformationSave=await Video.create(
        {
            title,
            description,
            duration:duration,
            isPublished:true,
            videoFile,
            thumbnail,
            owner:userId
        }
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoInformationSave,
            "video is succesfully uploaded!"
        )
    )
})
const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const userInfo=await Video.findById(videoId)
    if(!userInfo){
        throw new ApiErrors(400,"you don't have video for this videoId")
    }
    if(userInfo.owner===req.user._id){
        throw new ApiErrors(400,"Unauthorised request")
    }
    const allVideos=await Video.aggregate(
        [
            {
                $match:{
                    _id: new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $project:{
                    videoFile:1,
                    thumbnail:1
                }
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            allVideos,
            "this is the video for the given Id"
        )
    )
})
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const {title,description}=req.body
    const userInfo=await Video.findById(videoId)
    if(userInfo.owner===req.user._id){
        throw new ApiErrors(400,"Unauthorised request")
    }
    //TODO: update video details like title, description, thumbnail
    
    const videoDetails=await Video.findById(videoId)
    const cloudinaryOldUrl=videoDetails.thumbnail
    if(cloudinaryOldUrl){
        const Public_Id=publicId(cloudinaryOldUrl)
        await cloudinaryDeletePhoto(Public_Id)
    }
    const localPaththumbnail=req.file
    if(!localPaththumbnail){
        throw new ApiErrors(400,"please Upload a thumbnail!")
    }
    const cloudinaryThumbnailFile=await cloudinaryFileUplodad(localPaththumbnail.path)
    if(!cloudinaryThumbnailFile){
        throw new ApiErrors(500,"file is not aploaded at cloudinary!")
    }
    const thumbnailUrl=cloudinaryThumbnailFile.url
    const videoInfo=await Video.findByIdAndUpdate(
        videoId,
        {
            title:title,
            description:description,
            thumbnail:thumbnailUrl
        },
        {
            new:true
        }
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoInfo,
            "video details are successfully uploaded!"
        )
    )

})
const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    
    //TODO: delete video
    const videoInfo=await Video.findById(videoId)
    if(!videoInfo){
        throw new (400,"video is already deleted!")
    }
    if(videoInfo.owner===req.user._id){
        throw new ApiErrors(400,"Unauthorised request")
    }
    if(!videoId){
        throw new ApiErrors(400,"please give a valid videoId!")
    }

    if(videoInfo.videoFile?.trim()){
        const Public_Id_videoFile=publicId(videoInfo.videoFile)
        await cloudinaryDeleteFile(Public_Id_videoFile);
    }

    if(videoInfo.thumbnail?.trim()){
        const Public_Id_thumbnail=publicId(videoInfo.thumbnail)
        await cloudinaryDeletePhoto(Public_Id_thumbnail)
    }

    const newVideoInfo=await Video.findByIdAndDelete(
        videoInfo._id,
    )

    res.status(200).json(
        new ApiResponse(
            200,
            newVideoInfo,
            "yes successfully video is deleted!"))
})
const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const videoInfo=await Video.findById(videoId)
    
    if(videoInfo.owner===req.user._id){
        throw new ApiErrors(400,"Unauthorised request")
    }
    const isPublishedStatus=videoInfo.isPublished
    const video=await Video.findByIdAndUpdate(
        videoId,
        {
            isPublished:(!isPublishedStatus)
        },
        {
            new:true
        }
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                video:video
            },
            "yes isPublished status is toggled!"
        )
    )
})
export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
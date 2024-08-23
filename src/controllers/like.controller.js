import mongoose, {isValidObjectId, mongo} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiErrors} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    const userId=req.user._id
    if(!userId){
        throw new ApiErrors(400,"please login first!")
    }
    const isVideoLiked=await Like.find(
        {
            video:videoId,
            likeBy:userId
        }
        
    )
    //console.log(isVideoLiked)
    if(isVideoLiked.length!=0){
        await Like.findOneAndDelete(
            {
                video:videoId,
                likeBy:userId
                
            }
        )
        res.json(
            "video disliked"
        )
        //console.log("video disliked")
    }
    else
    {
        const createLike=await Like.create(
            {
                video:videoId,
                likeBy:userId
            }
        )
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createLike,
                "yes video is liked"
            )
        )
    }
   
})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    const userId=req.user._id
    if(!userId){
        throw new ApiErrors(400,"please login first!")
    }
    const isVideoLiked=await Like.find(
        {
            comment:commentId,
            likeBy:userId
        }
    )
    if(isVideoLiked.length!=0){
        await Like.findOneAndDelete(
            {
                comment:commentId,
                likeBy:userId
            }
        )
        res.json(
            "comment disliked"
        )
        //console.log("video disliked")
    }
    else
    {
        const createLike=await Like.create(
            {
                comment:commentId,
                likeBy:userId
            }
        )
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createLike,
                "yes comment is liked"
            )
        )
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    const userId=req.user._id
    if(!userId){
        throw new ApiErrors(400,"please login first!")
    }
    const isVideoLiked=await Like.find(
        {
            tweet:tweetId,
            likeBy:userId
        }
        
    )
    console.log()
    if(isVideoLiked.length!=0){
        await Like.findOneAndDelete(
            {
                tweet:tweetId,
                likeBy:userId
            }
        )
        res.json(
            "tweet disliked"
        )
        //console.log("video disliked")
    }
    else
    {
        const createLike=await Like.create(
            {
                tweet:tweetId,
                likeBy:userId
            }
        )
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createLike,
                "yes tweet is liked"
            )
        )
    }
   
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId=req.user._id
    const videoLiked=await Like.aggregate(
        [
            {
                $match:{
                    likeBy:new mongoose.Types.ObjectId(userId),
                    video:{"$exists":true}
                }
            },
            {
                $project:{
                    video:1
                }
            }
        ]
    )
    
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoLiked,
            "liked videos"
        )
    )
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
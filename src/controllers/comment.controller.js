import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiErrors} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const videoComments=await Comment.aggregate(
        [
            {
                $match:{
                    video:new mongoose.Types.ObjectId(videoId)
                }
            },
            {
                $project:{
                    content:1
                }
            },
            {
                $skip:(pageNumber-1)*pageSize
            },
            {
                $limit:pageSize
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            videoComments,
            "these are comments"
        )
    )
})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId}=req.params
    const userId=req.user._id
    const {content}=req.body

    const createComments=await Comment.create(
        {
            video:videoId,
            owner:userId,
            content:content
        }
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createComments,
            "a comment is added successfully!"
        )
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {videoId}=req.params
    const {userId}=req.user._id
    const {content}=req.body
    const updatedComment=await Comment.findOneAndUpdate(
        {
            video:videoId,
            owner:userId
        },
        {
            content:content 
        },
        {
            new:true
        }
    )
    res
    .satus(200)
    .json(
        new ApiResponse(
            200,
            updatedComment,
            "comment is updated!"
        )
    )
})
const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {videoId}=req.params
    const {userId}=req.user._id
    const {commentId}=req.params

    const deletedComment=await Comment.findOneAndDelete(
        {
            video:videoId,
            owner:userId,
            _id:commentId
        }
    )
    res
    .satus(200)
    .json(
        "comment is deleted for the given Id!"
    )

})

export {
    getVideoComments, 
    addComment, 
    updateComment,
    deleteComment
}
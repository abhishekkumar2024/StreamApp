import { asyncHandler } from "../utils/asyncHandler.js"
import { Tweet }  from "../models/tweet.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { ApiErrors } from "../utils/ApiError.js"
const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    const userId=req.user._id
    const tweetInfo=await Tweet.create(
        {
            content:content,
            owner:userId
        }
    )
    res
    .status(200)
    .json(
       new ApiResponse( 200,
        tweetInfo,
        "yes tweet is created successfully!"
       )
    )
})
const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const userId=req.user._id
    const userTweets=await Tweet.aggregate(
        [
            {
                $match:{
                    owner:userId
                }
            },
            {
                $project:{
                    owner:1,
                    content:1,
                }
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userTweets,
            "I got user Tweets "
        )
    )
})
const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { content }=req.body
    const { tweetId }=req.params
    const tweetInfo=await Tweet.findById(tweetId)
    if(!tweetInfo){
        throw new ApiErrors(400,"you don't have tweet for this tweetId!")
    }
    if(!tweetId){
        throw new ApiErrors(400,"you successfully not loggIn!")
    }
    const updatedTweet=await Tweet.findByIdAndUpdate(
        tweetId,
        {
            content:content
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
            updatedTweet,
            "you successfully updated tweets"
        )
    )
})
const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId}=req.params
    const tweetInfo=await Tweet.findById(tweetId)
    if(!tweetInfo){
        throw new ApiErrors(400,"you don't have tweet for this tweetId!")
    }
    if(!tweetId){
        throw new ApiErrors(
            400,
            "please give a tweetId!")
    }

    await Tweet.findByIdAndDelete(
        tweetId
    )
    res
    .status(200)
    .json(
        "you successfully deleted tweets"
    )
})
export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
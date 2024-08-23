import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import { ApiErrors} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user._id;

    const totalSubscriber = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup:{
                from :"subscriptions",
                localField:"channel",
                foreignField:"subscriber",
                as:"subscriberInfo"
            }
        },
        {
            $unwind:{
                path:"$subscriberInfo",
                preserveNullAndEmptyArrays:true
            }
        },
        {
            $group:{
                _id:null,
                totalSubscriber:{$sum:1}
            }
        },
        {
            $project:{
                _id:0,
                totalSubscriber:1
            }
        }
    ])
    const totalvideosAndViews=await Video.aggregate(
        [
            {
                $match:{
                    owner:new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $group:{
                    _id:"$owner",
                    totalVideos:{$sum:1},
                    totalViews:{$sum:"$view"}
                }
            },
            {
                $project:{
                    _id:0,
                    totalViews:1,
                    totalVideos:1
                }
            }
        ]
    )
    res.status(200)
    .json(
        new ApiResponse(
            200,
            {
                totalSubscriber,
                totalvideosAndViews
            },
            "channel status"
        )
    );
});
const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const userId=req.user._id
    const allVideos=await Subscription.aggregate(
        [
            {
                $match:{
                    channel: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"channel",
                    foreignField:"_id",
                    as:"userInfo",
                    pipeline:[
                        {
                            $lookup:{
                                from:"videos",
                                localField:"_id",
                                foreignField:"owner",
                                as:"videosInfo",
                                pipeline:[
                                    {
                                        $project:{
                                            title:1,
                                            description:1
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $addFields:{
                                videos:"$videosInfo"
                            }
                        },
                        {
                            $project:{
                                videos:1
                            }
                        }
                    ]
                }
            },
            {
                $project:{
                    userInfo:1
                }
            }
        ]
    )
    res.json(
        new ApiResponse(
            200,
            allVideos[0].userInfo[0].videos,
            "these are videos"
        )
    )
})
export {
    getChannelStats, 
    getChannelVideos
    }
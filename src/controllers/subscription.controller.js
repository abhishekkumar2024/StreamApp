import {asyncHandler} from "../utils/asyncHandler.js"
import { Subscription }  from "../models/subscription.model.js"
import { ApiErrors } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import User from "../models/user.model.js"
import mongoose from "mongoose"
const toggleSubscription = asyncHandler(async (req, res) => {
     // TODO: toggle subscription 
    const {channelId} = req.params

    const isValidChannel=await User.exists({_id:channelId})
    if(!isValidChannel){
        throw new ApiErrors(400,"please give a valid channel")
    }

    const userId =req.user._id
    // console.log(typeof userId)
    // console.log(userId)
    // console.log(typeof channelId)
    if(channelId==userId){
        throw new ApiErrors(400,"please give a valid Channel, subscriber and channel can't be same!")
    }
    const channel = await Subscription.aggregate([
        {
           $match:{
            channel:new mongoose.Types.ObjectId(channelId),
            subscriber:new mongoose.Types.ObjectId(userId)
           }
        }
    ]);
    
    if(channel.length!=0){
        const Response=await Subscription.deleteMany(
            {
                channel:channelId,
                subscriber:userId
            }
        )
        res
        .status(200)
        .send(
           "you unsubscribed the channel"
            )
    }
    else{
       const channelCreated= await Subscription.create(
            {
                channel:channelId,
                subscriber: userId
            }
        )
        console.log(channelCreated)
        res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channelCreated,
                "you have subscribed the channel"

            )
        )
    }
})
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberList=await Subscription.aggregate(
        [
            {
                $match:{
                    channel:new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $project:{
                   subscriber:1
                }
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            subscriberList,
            "List of Subscriber"
        )
    )
})
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const subscribedChannels=await Subscription.aggregate(
        [
            {
                $match:{
                    subscriber:new mongoose.Types.ObjectId(subscriberId)
                }
            },
            {
                $project:{
                    channel:1
                }
            }
        ]
    )
    res
    .status(200)
    .json(
       new ApiResponse( 
        200,
        subscribedChannels,
        "Subscribed Channels!")
    )

})
export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
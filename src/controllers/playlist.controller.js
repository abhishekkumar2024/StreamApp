import { ApiErrors } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Playlist } from "../models/playlist.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"
const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
    if(!(name&&description)){
        throw new ApiErrors(400,"Please give name and description!")
    }
    const userId=req.user._id
    const createPlaylist=await Playlist.create(
        {
            name,
            description,
            owner:userId,
        }
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            createPlaylist,
            "playlist is created!"
        )
    )
})
const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
    if(userId!=req.user._id){
        throw new ApiErrors(400,"please give valid userId")
    }
    const userplaylist=await Playlist.aggregate(
        [
            {
                $match:{
                    owner: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $project:{
                    name:1,
                    description:1
                }
            }
        ]
    )
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            userplaylist,
            "these are user playlist!"
        )
    )
})
const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    console.log(playlistId)
    const playlistById=await Playlist.aggregate(
        [
            {
                $match:{
                    _id:new mongoose.Types.ObjectId(playlistId)
                }
            },
            {
                $project:{
                    name:1,
                    description:1
                }
            }
        ]
    )
    console.log(playlistById)
    if(playlistById.length==0){
        res.json("there is no playlist for this playlistId")
    }
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlistById,
            " playlistById !"
        )
    )

})
const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

     const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $push: { videos: videoId } },
        { new: true }
    )

    //console.log(newPlaylist);

    res.status(200).json(
        new ApiResponse(
            200,
            updatedPlaylist,  // Assuming there's only one playlist with the given ID
            "Video is added to the playlist"
        )
    );
})
const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: videoId } },
        { new: true }
    )
    if(!updatedPlaylist){
        throw new ApiErrors(400,"video is not removed!")
    }
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "video is removed!"
        )
    )
})
const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    const deletedPlaylist=await Playlist.findByIdAndDelete(
        playlistId
    )
    res
    .status(200)
    .json(
        "playlist is deleted!"
    )
})
const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    const playlistUpdated=await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name:name,
            description:description
        },
        {
            new:true
        }
    )
    //console.log(playlistUpdated)
    if(!playlistUpdated){
        throw new ApiErrors(400,"you don't have playlist for this playlistId!")
    }
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            playlistUpdated,
            "playlist is updated successfully"
        )
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
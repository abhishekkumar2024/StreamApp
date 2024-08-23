import { Router } from "express"
import { 
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist, } from "../controllers/playlist.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const router=Router()

router.route('/createPlaylist').post(
    verifyJWT,
    createPlaylist)
router.route('/getUserPlaylists/:userId').get(
    verifyJWT,
    getUserPlaylists)
router.route('/getPlaylistById/:playlistId').get(
    verifyJWT,
    getPlaylistById)
router.route('/addVideoToPlaylist/:playlistId/:videoId').put(
    verifyJWT,
    addVideoToPlaylist)
router.route('/removeVideoFromPlaylist/:playlistId/:videoId').put(
    verifyJWT,
    removeVideoFromPlaylist)
router.route('/deletePlaylist/:playlistId').put(
    verifyJWT,
    deletePlaylist)
router.route('/updatePlaylist/:playlistId').put(
    verifyJWT,
    updatePlaylist,)


export const playlistRouter=router
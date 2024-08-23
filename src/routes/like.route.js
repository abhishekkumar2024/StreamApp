import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { toggleCommentLike,toggleVideoLike,toggleTweetLike,getLikedVideos } from "../controllers/like.controller.js"
const router=Router()
router.route('/toggleCommentLike/:videoId').post(
    verifyJWT,
    toggleCommentLike
)
router.route('/toggleVideoLike/:videoId').post(
    verifyJWT,
    toggleVideoLike
)
router.route('/toggleTweetLike/:tweetId').post(
    verifyJWT,
    toggleTweetLike
)
router.route('/getLikedVideos').get(
    verifyJWT,
    getLikedVideos
)
export const LikeRouter=router
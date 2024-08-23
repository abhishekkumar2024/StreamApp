import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { 
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet } from "../controllers/tweet.controller.js"
const router=Router()

router.route('/createTweet').post(
    verifyJWT,
    createTweet
)
router.route('/getUserTweets').get(
    verifyJWT,
    getUserTweets
)
router.route('/updateTweet/:tweetId').put(
    verifyJWT,
    updateTweet
)
router.route('/deleteTweet/:tweetId').put(
    verifyJWT,
    deleteTweet
)
export const tweetRouter=router
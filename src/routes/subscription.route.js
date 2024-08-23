import { Router } from "express"
import { toggleSubscription,getUserChannelSubscribers,getSubscribedChannels } from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
const router=Router()

router.route('/toggleSubscription/:channelId').post(
    verifyJWT,
    toggleSubscription
)
router.route('/getUserChannelSubscribers/:channelId').get(
    verifyJWT,
    getUserChannelSubscribers
)
router.route('/getSubscribedChannels/:subscriberId').get(
    verifyJWT,
    getSubscribedChannels
)

export const subscriptionsRouter=router
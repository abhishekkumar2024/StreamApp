import { Router } from "express"
import { verifyJWT } from "../middleware/auth.middleware.js"
import { 
    getVideoComments,
    addComment,
    updateComment,
    deleteComment} from "../controllers/comment.controller.js"
const router=Router()
router.route('/getVideoComments/:videoId').get(
    verifyJWT,
    getVideoComments
)
router.route('/addComment/:videoId').post(
    verifyJWT,
    addComment
)
router.route('/updateComment/:videoId').post(
    verifyJWT,
    updateComment
)
router.route('/deleteComment/:videoId').post(
    verifyJWT,
    deleteComment
)
export const CommentRouter=router
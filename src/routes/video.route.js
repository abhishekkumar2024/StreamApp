import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import { publishAVideo } from "../controllers/video.controller.js"
import { getVideoById } from "../controllers/video.controller.js"
import { updateVideo } from "../controllers/video.controller.js"
import { deleteVideo } from "../controllers/video.controller.js";
import { togglePublishStatus } from "../controllers/video.controller.js"

const router=Router()

router.route('/publishAVideo').post(
    verifyJWT,
    upload.fields(
        [
            {
                name:"videoFile",
                maxCount:1  
            },
            {
                name:"thumbnail",
                maxCount:1
            }
        ]
    ),
    publishAVideo
    )
router.route('/getVideoById/:videoId').get(
    verifyJWT,
    getVideoById)
router.route('/updateVideo/:videoId').put(
    verifyJWT,
    upload.single("thumbnail"
),
updateVideo)
router.route('/deleteVideoFile/:videoId').put(
    verifyJWT,
    deleteVideo)
router.route('/togglePublishStatus/:videoId').put(
    verifyJWT,
    togglePublishStatus)
export const videoRouter=router

import { Router } from "express";
import { logInUser, logOutUser, registerUser, updateUsercoverImage } from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { generateReFreshToken } from "../controllers/user.controller.js";
import { passwordUpdate } from "../controllers/user.controller.js";
import { getCurrentUser } from "../controllers/user.controller.js";
import { updateAccountDetails } from "../controllers/user.controller.js";
import { updateUserAvatar } from "../controllers/user.controller.js";
import { getUserChannelProfile } from "../controllers/user.controller.js";
const router=Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)
router.route("/login").post(logInUser)

router.route("/logout").post(verifyJWT,logOutUser)

router.route("/refresh-token").post(generateReFreshToken)

router.route("/passwordUpdate").post(verifyJWT,passwordUpdate)

router.route("/getCurrentUser").get(verifyJWT,getCurrentUser)

router.route("/updateAccountDetails").put(verifyJWT,updateAccountDetails)

router.route("/updateUserAvatar").put(
    upload.single('avatar'), // 'avatar' is the name of the field containing the file
    verifyJWT,
    updateUserAvatar
)

router.route("/updateUsercoverImage").put(
    upload.single('coverImage'
    ),verifyJWT,
    updateUsercoverImage)

router.route("/getUserChannelProfile/:username").get(verifyJWT,getUserChannelProfile)
export default router
import multer from "multer"
import multer_File_Path from "../constants.js"

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, multer_File_Path)
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({storage})

import multer, { diskStorage } from "multer";

const storage = diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/temp')
    },

    filename: function(req, file, cb) {
        const suffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + suffix + "-" + file.originalname)
    }
})

export const upload = multer({storage: storage})
import multer from "multer";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/temp');
    }, filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
export const upload = multer({ storage });

export const preMulterMiddleware = (req, res, next) => {
    req._body = req.body;
    next();
}
export const postMulterMiddleware = (req, res, next) => {
    req.body.user=req._body.user
    next();
}

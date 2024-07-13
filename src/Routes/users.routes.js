import { Router } from "express";
import { SendAndSaveOTP, UserInfo, GoogleAuth, UserImage, registerUser, DeleteUser, login, logout, ForgetPassword } from "../Controllers/user.controller.js";
import {postMulterMiddleware, preMulterMiddleware, upload } from "../middleware/multer.middleware.js";
import { Auth } from "../middleware/auth.middleware.js";


const userRouter = Router();

userRouter.route("/register").post(registerUser)
userRouter.route('/profileImage').post(
    Auth,
    preMulterMiddleware,
    upload.single('profileImage'),
    postMulterMiddleware,
    UserImage);
userRouter.route('/delete').post(Auth, DeleteUser);
userRouter.route('/login').post(login);
userRouter.route('/ForgetPassword').post(ForgetPassword);
userRouter.route('/logout').post(Auth, logout);
userRouter.route('/UserInfo').post(UserInfo);
userRouter.route('/GoogleAuth').post(GoogleAuth);
userRouter.route('/SendAndSaveOTP').post(SendAndSaveOTP);

export default userRouter;
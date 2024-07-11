import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiError } from "../utiles/ApiError.js"
import { ApiResponse } from "../utiles/ApiResponse.js";
import { user } from "../Models/user.model.js";
import { UploadFile } from "../utiles/cloudnary.js"
import { mails } from "../Models/mail.model.js";
import bcrypt from "bcrypt";


const Option = {
    HttpOnly: true,
    secure: true,// Automatic insert Cookies into header by API testers
    maxAge: 3600000,
    sameSite: 'None'
}



const GetTokens = async (userID) => {
    try {
        const User = await user.findById(userID);
        const AccessToken = User.GetAccessToken();
        const RefreshToken = User.GetRefreshToken();
        User.refreshToken = RefreshToken;
        User.save({ validateBeforeSave: false });
        return {
            AccessToken, RefreshToken
        }
    } catch (err) {
        res.status(500).json(new ApiError(500, "Internal server error while generating tokens"))
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Get Form Data or user data
    // Data Validation : empty
    // check user exit or not
    // check for file
    // upload image to cloudnary
    // create user object
    // upload in DB
    // send response to user without secret

    const { email, password } = req.body;

    if (Object.keys(req.body).length <= 0) {
        return res.json(new ApiError(400, "All input are fields required"));
    }

    if (email === "" || password === "") {
        return res.json(new ApiError(400, "All fields required"));
    } else if (!email.includes('@')) {
        return res.json(new ApiError(400, "Email are not"));
    }

    const ExitUser = await user.findOne({ "email": email });
    if (ExitUser) {
        return res.json(new ApiError(409, "User already exits", "ERROR"));
    }


    const NewUser = await user.create({
        email, password
    })
    const CreatedUser = await (user.findById(NewUser._id)).select("email _id");

    if (!CreatedUser) {
        return res.json(new ApiError(500, "Please try again"));
    }


    //User Response
    return res.status(200).json(new ApiResponse(200, CreatedUser, "User Created"));
})

const UserImage = asyncHandler(async (req, res) => {
    if ((req.body.user) == undefined) {
        return res.json(new ApiError(404, "User Request is Empty"));
    }
    const profilePath = (req.files?.profileImage[0]?.path) || req?.file?.path;
    if (!profilePath)
        return res.json(new ApiError(400, "Profile File Required"));

    const UploadImage = await UploadFile(profilePath);
    //Required : req.user._id
    const UploadImgObj = await user.findOneAndUpdate(req?.body?.user?._id, { profileImage: UploadImage.secure_url }).select("-password ");
    if (!UploadImgObj) {
        return res.json(new ApiError(404, "User not found"));
    }
    const UpdatedUser = await user.findById(UploadImgObj?._id).select("-_id -password");
    return res.status(200).json(
        new ApiResponse(200, UpdatedUser, "File Uploaded Successfully")
    )
})

const DeleteUser = asyncHandler(async (req, res) => {
    const Request = req.body;
    if (Object.keys(Request).length <= 0) {
        return res.json(new ApiError(400, "User not found"));
    }

    const ExitUser = await user.findOne({ "email": Request.email });
    if (!ExitUser) {
        return res.json(new ApiError(409, "User Not Exits"));
    } else {
        if (await ExitUser.isPasswordCorrect(Request.password)) {
            ExitUser.sendMails.forEach(async (e) => {
                await mails.deleteOne({ _id: e });
            })
            await user.deleteOne({ "email": Request.email });
        } else {
            return res.json(new ApiError(400, "Invalid Password"));
        }
    }
    return res.status(200)
        .clearCookie('AccessToken', Option)
        .clearCookie('RefreshToken', Option)
        .json(new ApiResponse(200, true, `${Request.email}'s Account Deleted !!`));
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const ExitUser = await user.findOne({ $or: [{ email }] });
    if (!ExitUser) {
        return res.json(new ApiError(409, "User not found"));
    }
    const isPassValid = await ExitUser.isPasswordCorrect(password);
    if (!isPassValid) {
        return res.json(new ApiError(409, "Invalid Cretential"));
    }
    const { AccessToken, RefreshToken } = await GetTokens(ExitUser._id);
    const userInfo = await user.aggregate((
        [
            {
                $match: {
                    _id: ExitUser._id
                }
            },
            {
                $unset: ["password", "refreshToken"]
            },
            {
                $lookup: {
                    from: "mails",
                    localField: "sendMails",
                    foreignField: "_id",
                    as: "sendMails",
                }
            }
        ]
    ));
    if (!userInfo) {
        return res.json(new ApiError(500, "Internal Error "));
    }
    return res
        .status(200)
        .cookie("AccessToken", AccessToken, Option)
        .cookie("RefreshToken", RefreshToken, Option)
        .json(
            new ApiResponse(200, { "user": userInfo[0] }, "User Login Successfully")
            // new ApiResponse(200, { "user": userInfo[0], "Tokens": [{ AccessToken: AccessToken }, { RefreshToken: RefreshToken }] }, "User Login Successfully")
        )
})

const logout = asyncHandler(async (req, res) => {
    const Response = await user.findOneAndUpdate(req.body.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, {
        new: true
    });
    if (!Response) {
        return res.json(new ApiError(500, "Something wrong"));
    }
    return res.status(200)
        .clearCookie('AccessToken')
        .clearCookie('RefreshToken')
        .json(
            new ApiResponse(200, true, "Logout Successfull")
        )
})

const ForgetPassword = asyncHandler(async (req, res) => {
    const email = req.body?.email;
    const NewPassword = req.body?.NewPassword;
    const UserFind = await user.findOne({ 'email': email });
    if (!UserFind) {
        return res.json(new ApiError(404, "User not Exit"));
    }
    const EncryptPass = await bcrypt.hash(NewPassword, 10);
    const NewUser = await user.findByIdAndUpdate(UserFind._id, { $set: { password: EncryptPass } }, { new: true });
    if (!NewUser) {
        return res.json(new ApiError(500, "Password changed Error"));
    }
    return res.status(200).json(
        new ApiResponse(200, true, "Password changed",)
    )
})

const UserInfo = asyncHandler(async (req, res) => {
    const email = req.body.email;
    const User = await user.findOne({ email: email }).select("-password");
    if (!User) {
        return res.json(new ApiError(404, "User not found"))
    }
    //Aggregiation pipeline
    const UserInfo = await user.aggregate(
        [
            {
                $match: {
                    email: email
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $lookup: {
                    from: "mails",
                    localField: "sendMails",
                    foreignField: "_id",
                    as: "sendMails",
                    pipeline: [
                        {
                            $lookup: {
                                from: "users",
                                localField: "owner",
                                foreignField: "_id",
                                as: "owner",
                                pipeline: [
                                    {
                                        $project: {
                                            password: 0
                                        }
                                    }
                                ]
                            }
                        },
                        {
                            $sort: {
                                createdAt: -1
                            }
                        }
                    ]
                }
            },
            {
                $project: {
                    password: 0,
                    refreshToken:0
                }
            }
        ]
    )
    return res.status(200)
        .json(
            new ApiResponse(200, UserInfo, "User information")
        )

});

export { UserInfo, registerUser, UserImage, DeleteUser, login, logout, GetTokens, ForgetPassword }
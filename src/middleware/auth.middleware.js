import { asyncHandler } from "../utiles/asyncHandler.js";
import { ApiError } from "../utiles/ApiError.js";
import { user } from "../Models/user.model.js";
import jwt from 'jsonwebtoken';
import { GetTokens } from '../Controllers/user.controller.js';

export const Auth = asyncHandler(async (req, res, next) => {
    try {
        const AccessToken = req.body.cookie?.AccessToken || (req.headers.cookie?.split(' ')[0])?.replace("AccessToken=", "")?.replace(';', '');
        const RefreshToken = req.body.cookie?.RefreshToken || (req.headers.cookie?.split(' ')[1])?.replace("RefreshToken=", "")?.replace(';', '');
        if (!AccessToken) {
            return res.json(new ApiError(404, "Unauthorized Request"));
        }
        jwt.verify(AccessToken, process.env.JWT_TOKEN, async (err, info) => {
            if (err) {
                jwt.verify(RefreshToken, process.env.JWT_TOKEN, async (err, info) => {
                    if (err) {
                        return res.json(new ApiError(401, "Invalid Request in Authentication"));
                    } else {
                        const User = await user.findById(info?._id);
                        if (!User) {
                            return res.json(new ApiError(404, "User not found"));
                        }
                        const { NewAccessToken, NewRefreshToken } = await GetTokens(User?._id);
                        req.body.user = User;
                        next();
                    }
                })
            } else {
                const User = await user.findById(info?._id).select('-password');
                if (!User) {
                    return res.json(new ApiError(500, "User not found"));
                }
                req.body.user = User;
                next();
            }
        });
    } catch (error) {
        return res.json(new ApiError(500, "Server Error"));
    }
});
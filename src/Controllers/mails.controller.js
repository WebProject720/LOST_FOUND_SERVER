import mongoose from "mongoose";
import { mails } from "../Models/mail.model.js";
import { ApiResponse } from "../utiles/ApiResponse.js";
import { asyncHandler } from "../utiles/asyncHandler.js";
import { UploadFile, DeleteImage } from "../utiles/cloudnary.js";
import { ApiError } from "../utiles/ApiError.js";
import { user } from "../Models/user.model.js";
import DOMPurify from "dompurify";
import { JSDOM } from 'jsdom'

const postFun = async (id) => {
    const post = await mails.aggregate([
        {
            $match: {
                _id: id
            }
        }, {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $set: {
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        },
        {
            $unset: ["owner.password", "owner.refreshToken"]
        }
    ]);
    return post;
}

const checkPost = () => {

}

const WriteMail = asyncHandler(async (req, res) => {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const { subject, type } = req.body;
    const body = purify.sanitize(req.body.body);
    if (type == "") {
        return res.json(new ApiError(500, "Mail Type is required"));
    }
    const ImagePath = (req.files?.image[0]?.path) || req?.file?.path;
    var UploadImage;
    if (ImagePath) {
        UploadImage = await UploadFile(ImagePath);
        if (!UploadImage) {
            return res.json(new ApiError(500, "Image not Updated"));
        }
    }
    const NewMail = await mails.create(
        {
            body: body || "",
            subject: subject || "",
            MailType: type.toUpperCase(),
            owner: req.body.user._id,
            Image: false || UploadImage?.secure_url
        }
    );
    const InsertMail = await mails.findById(NewMail._id);
    const UpdateOwner = await user.findOneAndUpdate(req.body.user._id, {
        $addToSet: {
            sendMails: { $each: [new mongoose.Types.ObjectId(InsertMail._id)] }
        }
    }, { new: true });
    const post = await postFun(InsertMail._id)
    return res
        .status(200)
        .json(
            new ApiResponse(200, post[0], "User Created Successfully")
        )
})

const ChangeStatus = asyncHandler(async (req, res) => {
    const { MailID, user } = req.body;
    console.log(MailID, user);
    if (!req.body.MailID) {
        return res.json(new ApiError(400, "Mail not Identify"));
    }
    const Mail = await mails.findById(req.body.MailID);
    if (!Mail) {
        return res.json(new ApiError(400, "Mail not found"));
    }
    await mails.findOneAndUpdate(Mail._id, {
        status: !Mail.status
    }, { new: true });
    const UpdatedMail = await postFun(Mail._id);
    return res.status(200)
        .json(
            new ApiResponse(200, UpdatedMail[0], "Status Changed")
        )
});

const DeleteMail = asyncHandler(async (req, res) => {
    const Mail = await mails.findById(new mongoose.Types.ObjectId(req.body.MailID));
    if (!Mail) {
        return res.json(new ApiError(404, "Mail not found"));
    }
    await DeleteImage(Mail?.Image || "");
    const UpdatedMail = await mails.deleteOne(Mail?._id);
    return res.status(200)
        .json(
            new ApiResponse(200, UpdatedMail, "Mail Deleted")
        )
})

const ReplyForMail = asyncHandler(async (req, res) => {
    const { _id, msg, user } = req.body;
    const Mail = await mails.findById(_id);
    if (!Mail) {
        return res.json(new ApiError(404, "Mail not found"));
    }
    const UpdateMail = await mails.findOneAndUpdate(Mail._id, {
        $addToSet: {
            Reply: {
                $each: [{
                    user: user.email,
                    profileImage: user.profileImage,
                    username: user.username,
                    name: user.name,
                    msg: msg,
                    createdAt: new Date()
                }]
            }
        }
    }, { new: true });
    const post = await postFun(UpdateMail._id)
    if (!UpdateMail || !post) {
        return res.json(new ApiError(500, "Update failed !!"));
    }

    return res.status(200)
        .json(
            new ApiResponse(200, post[0], "Reply Send Successfully")
        )
})

const updatePost = asyncHandler(async (req, res) => {
    const window = new JSDOM('').window;
    const purify = DOMPurify(window);
    const { type, subject, body, id } = req.body;
    const postExit = await mails.findById(id);
    const ImagePath = (req.files?.image[0]?.path) || req?.file?.path;
    var UploadImage;
    if (ImagePath) {
        UploadImage = await UploadFile(ImagePath);
        if (!UploadImage) {
            return res.json(new ApiError(500, "Image not Updated"));
        } else {
            await mails.findOneAndUpdate(postExit._id, {
                Image: UploadImage?.secure_url
            })
        }
    }
    const post = await mails.findOneAndUpdate(postExit._id, {
        $set: {
            subject,
            body: purify.sanitize(body),
            MailType: type
        }
    }, { new: true })
    if (!post) {
        return res.json(
            new ApiError(404, "post not found")
        )
    }
    const updatedPost = await postFun(post._id);

    return res.status(200).json(
        new ApiResponse(200, updatedPost[0], "post updated")
    )
})

const GetMail = asyncHandler(async (req, res) => {
    const { _id } = req.body;
    if (!_id) {
        return res.json(new ApiError(400, "Mail ID not Identify"));
    }
    const Mail = await postFun(_id)
    return res.status(200)
        .json(
            new ApiResponse(200, Mail, "Found mail")
        )
})

const Search = asyncHandler(async (req, res) => {
    // const Searched = await mails.find({ $text: { $search: (req.body.string) } });
    const Searched = await mails.aggregate([
        { $match: { $text: { $search: (req.body.string) } } },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $set: {
                owner: { $arrayElemAt: ["$owner", 0] }
            }
        },
        {
            $unset: ["owner.password", "owner.refreshToken"]
        }
    ])
    return res.status(200).json(
        new ApiResponse(200, Searched, "Found mail")
    )
});


const AllMails = asyncHandler(async (req, res) => {
    //-d count
    //-d dates
    let { to, from, countStart, countEnd } = req.body;
    if (from == "") from = (new Date().toISOString());
    let response;
    if (to != "" && from != "") {
        response = await mails.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: to,
                        $lt: from
                    }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $set: {
                    owner: { $arrayElemAt: ["$owner", 0] }
                }
            },
            {
                $unset: ["owner.password", "owner.refreshToken"]
            }
        ]);
    } else {
        if (countStart == "") countStart = 0;
        if (countEnd == "") countEnd = 10;
        response = await mails.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: countStart // no of docs to be skip from up side
            },
            {
                $limit: countEnd// No of docs to be need 
            },

            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "owner"
                }
            },
            {
                $set: {
                    owner: { $arrayElemAt: ["$owner", 0] }
                }
            },
            {
                $unset: ["owner.password", "owner.refreshToken"]
            }
        ])
    }
    const CollectionLength = await mails.aggregate([
        { $count: "length" }
    ])
    return res.status(200).json(
        new ApiResponse(200, response, { length: (CollectionLength[0])?.length || 0, from: to, to: from, countStart: countStart, countEnd: countEnd })
    )
});

export { AllMails, WriteMail, ChangeStatus, updatePost, DeleteMail, ReplyForMail, GetMail, Search };
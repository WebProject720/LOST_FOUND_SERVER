import 'dotenv/config.js'
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { collection } from '../constants.js';
const object = {
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        unique: false
    },
    profileImage: {
        type: String,//cloudnary Source
        default: ""
    },
    sendMails: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: collection.mails
        }]
    },
    refreshToken: {
        type: String,
        required: false,
        unique: false,
        default:''
    },

};

const schema = new mongoose.Schema(object, { timestamps: true });
// bcrypt : Encrypt and Decrypt password and Save 
//hooks
//Encrypt Password after saving it
schema.pre('save', async function (next) {
    //check password is changed or not
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

schema.methods.HashPassword = async (password) => {
    return (await bcrypt.hash(password, 10));
}

//Check Password 
schema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}
//generate JWT tokens
schema.methods.GetAccessToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.JWT_TOKEN, {
        expiresIn: process.env.ACCESS_TOKEN_EXP
    })
}
schema.methods.GetRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    }, process.env.JWT_TOKEN, {
        expiresIn: process.env.REFRESH_JWT_EXPIRES
    })
}

export const user = new mongoose.model(collection.users, schema, collection.users);
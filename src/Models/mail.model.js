import mongoose from "mongoose";
import { collection } from '../constants.js';
const object = {
    body: {
        type: String,
        required: false,
        unique: false
    },
    subject: {
        type: String,
        required: false,
        unique: false
    }
    ,
    status: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: collection.users,
        required: true
    }
    ,
    Image: {
        type: String,
        default: null
    },
    MailType: {
        type: String,
        required: true
    },
    Reply: [{
        user: {
            type: String,
            required: false
        },
        msg: {
            type: String,
            required: false
        },
        createdAt: {
            type: Date
        },
        profileImage:{
            type:String
        },
        username:{
            type:String
        },
        name:{
            type:String
        }
    }]
}
const schema = new mongoose.Schema(object, { timestamps: true });
export const mails = new mongoose.model(collection.mails, schema, collection.mails);
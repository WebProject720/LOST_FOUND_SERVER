import mongoose from "mongoose";
import { collection } from "../constants.js";
const OTP={
    OTP:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    }
}
const OtpSchema=new mongoose.Schema(OTP, { timestamps: true });
const OtpModel=new mongoose.model(collection.otp,OtpSchema,collection.otp)
export {OtpModel};
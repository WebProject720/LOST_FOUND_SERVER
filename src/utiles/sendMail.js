import nodemailer from 'nodemailer';
import { user } from '../Models/user.model.js';
import 'dotenv/config'


const sendOTP = async (email) => {
    const RandomNumber = Math.round(Math.random() * 10000);
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            service: "gmail",
            secure: true,
            auth: {
                user: process.env.MAIL_SENDER,
                pass: process.env.PASSWORD
            },
        });
        const mailOptions = {
            from: process.env.MAIL_SENDER,
            to: email,
            subject: "Lost & Found : OTP",
            text: `Here is your OTP (One Time Password) ${RandomNumber}`,
        }
        const res = await transporter.sendMail(mailOptions);
        if (!res) { return false };
        return { "Response": res, "OTP": RandomNumber };
    } catch (error) {
        console.log("ERROR", error)
    }
    return false;
}

const UpdateUserOTP = async (_id, OTP) => {
    user.findOneAndUpdate({ _id }, { $set: { "OTP": OTP } }, { returnDocument: 'after' }).then((response) => {
        console.log(response);
        return response;
    }).catch((error) => {
        console.log("ERROR : ", error);
    })
    return false;
}
export { sendOTP, UpdateUserOTP };
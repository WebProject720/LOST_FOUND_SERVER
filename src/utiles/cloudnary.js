import 'dotenv/config'
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import { ApiError } from './ApiError.js';

//      Configration to Cloudnary    
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.API_CLOUDNARY_KEY,
    api_secret: process.env.API_CLOUDNARY_PASSWORD
});

//Upload File : 
export const UploadFile = async function (filepath) {
    try {
        if (!filepath) return null;
        const response = await cloudinary.uploader.upload(filepath, {
            resource_type: "auto"
        })
        fs.unlinkSync(filepath);
        return response;
    } catch (error) {
        fs.unlinkSync(filepath);
        //File not uploaded
        return null;
    }
}

// Delete Image from cloudinary
export const DeleteImage = async (url) => {
    if (url == "") {
        return
    }
    const slash = url.split('').reverse().join('').indexOf('/');
    const id = url.split('').reverse().join('').slice(4, slash).split('').reverse().join('');
    try {
        const response = await cloudinary.uploader.destroy(id);
        return response;
    } catch (err) {
        throw new ApiError(404, err, "Image not delete");
    }
}

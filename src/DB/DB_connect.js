import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import mongoose from "mongoose";

export const DB_connect = async () => {
    try {
        // const response = await mongoose.connect(process.env.DATABASE_URL+`/${process.env.DATABASE_NAME}`);
        const response = await mongoose.connect(process.env.DATABASE_URL_ON+`/${process.env.DATABASE_NAME}`);
        console.log(`DATABASE CONNECTED TO : ${response.connection.name}`);
        mongoose.connection.on('disconnected', (e) => {
            console.log("DATABASE DISCONNECTED !!");
        })
    } catch (err) {
        console.log("ERROR : MONGODB CONNECTION FAILED");
        throw err;
    }
}
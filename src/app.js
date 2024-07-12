import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middleware
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"));
app.use(cookieParser());

const whiteList = ['http://localhost:5173'];
const CorsOption = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) != -1) {
            callback(null, true)
        } else {
            throw new ApiError(404, "URL not allowed",)
        }
    },
    credentials:true
}
app.use(cors(CorsOption));

import userRouter from './Routes/users.routes.js';
app.use("/api/v1/users", userRouter);
import MailsRoute from './Routes/mails.routes.js';
import { ApiError } from './utiles/ApiError.js';
app.use('/api/v1/mails', MailsRoute);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'NotFound.html'));
});

export default app;

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config'
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

const corsOption = {
    origin: process.env.WHITELIST_DOMAIN,
    credentials: true,
    optionsSuccessStatus: 200,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE'
}
app.use(cors(corsOption));

import userRouter from './Routes/users.routes.js';
app.use("/api/v1/users", userRouter);
import MailsRoute from './Routes/mails.routes.js';
app.use('/api/v1/mails', MailsRoute);

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'NotFound.html'));
});


export default app;

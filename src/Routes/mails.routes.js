import { Router } from "express";
import { AllMails, Search, ChangeStatus, WriteMail, DeleteMail, GetMail, ReplyForMail } from "../Controllers/mails.controller.js";
import { Auth } from "../middleware/auth.middleware.js";
import { postMulterMiddleware, preMulterMiddleware, upload } from "../middleware/multer.middleware.js";


const MailsRoute = Router();

MailsRoute.route('/WriteMail').post(Auth, preMulterMiddleware, upload.single("image"), postMulterMiddleware, WriteMail);
MailsRoute.route('/ChangeStatus').post(Auth, ChangeStatus);
MailsRoute.route('/DeleteMail').post(Auth, DeleteMail);
MailsRoute.route('/ReplyForMail').post(Auth, ReplyForMail);
MailsRoute.route('/GetMail').post(GetMail);
MailsRoute.route('/Search').post(Search);
MailsRoute.route('/allmails').post(AllMails);
export default MailsRoute;
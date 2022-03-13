import express, { Express } from 'express'
import MailController from './email.controller'

const mailRouter = (app:Express) => {
    const router = express.Router()
    const mailRouteController:MailController = new MailController();

    router.post('/',async(req,res) => {
        await mailRouteController.sendEmail(req,res);
    })
    app.use("/api/v1/mailer",router);

}

export default mailRouter
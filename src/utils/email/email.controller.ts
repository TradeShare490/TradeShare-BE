import e, { Request, Response } from 'express'
import EmailService from './email.service'
import { messages } from '../../db/messages'; 

class MailController {
    private emailService:EmailService;
    constructor(){
        this.emailService = new EmailService();
    }

    async sendEmail(req:Request,res:Response){
        try{
            const mail = this.emailService.send(req.body);
            return messages.successMessage('success','sentMail',mail)
        } catch(error:any){
            if (error.response === undefined){
                return messages.internalError(error.message)
            } else {
                return messages.internalError(error.response.data.message)
            }
        }   

    }

}
export default MailController;
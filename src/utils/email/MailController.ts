import { Request, Response } from 'express'
import EmailService from './email.service'
import { messages } from '../../db/messages'; 
import { MailOption } from './email';

class MailController {
    private emailService:EmailService;
    constructor(){
        this.emailService = new EmailService();
    }

    async sendEmail(req:Request,res:Response){
        try{
            if(this.inputTester(req.body)){
            const mail = this.emailService.send(req.body);
            return res.send(messages.successMessage('success','sentMail',mail))
            } else{
                throw new Error();
            }
        } catch(error:any){
            if (error.response === undefined){
                return messages.internalError(error.message)
            } else {
                return messages.internalError(error.response.data.message)
            }
        }   

    }
    // the purpose of this method is to act as a typeguard to make sure that the request of the body is correct!
     inputTester(arg:any): arg is MailOption {
        return arg && arg.to && arg.subject && typeof(arg.to) == 'string' && typeof(arg.subject) == 'string';
    }
}

export default MailController;
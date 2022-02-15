import express, { Express, Request, Response } from "express";
import MessageController from "../../controllers/MessageController";

const messageRoute = (app: Express) => {
    const router = express.Router(); 
    const messageController = new MessageController(); 

    router.post("/", (req: Request, res: Response) => {
        messageController.sendMessage(req,res);
    })

    router.get("/:conversationId", (req: Request, res: Response) => {
        messageController.getMessage(req,res);
    })
    app.use("/api/v1/message/", router)
}

export default messageRoute;
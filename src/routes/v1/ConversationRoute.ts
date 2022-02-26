import express, { Express, Request, Response } from "express";
import ConversationController from "../../controllers/ConversationController";

const conversationRoute = (app: Express) => {

    const router = express.Router();
	const conversationController = new ConversationController();
	

	router.post("/", (req: Request, res: Response) => {
		conversationController.createConversation(req, res);
	});

    router.get("/:username", (req: Request, res: Response) => {
        conversationController.getConversations(req, res);
    })

    router.delete("/:id", (req: Request, res: Response) => {
        conversationController.deleteConversation(req, res);
    })
    
    app.use("/api/v1/conversation/", router);
};

export default conversationRoute;
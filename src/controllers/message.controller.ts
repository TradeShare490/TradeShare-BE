import MesssageService from "../db/service/message.service";
import { Request, Response } from "express";
import mongoose from "mongoose";
import ConversationService from "../db/service/conversation.service";
import { messages } from "../db/messages";

class MessageController {
	private messageService: MesssageService;
	private conversationService: ConversationService;

	constructor() {
		this.messageService = new MesssageService();
		this.conversationService = new ConversationService();
	}

	async sendMessage(req: Request, res: Response) {
		const conversationId = new mongoose.Types.ObjectId(req.body.conversationId);
		const conversation = await this.conversationService.findConversation({ _id: conversationId });
		if (conversation?._id) {
			let message = await this.messageService.createMessage(
				req.body.sender,
				req.body.message,
				conversation._id
			);
			this.conversationService.updateConversation(
				{ _id: conversation._id },
				{ latestMessage: message.message },
				{
					new: true,
				}
			);
			return res.status(message.status).send(message);
		}
		return res.send(messages.internalError("Conversation doesn't exist"));
	}

	async getMessage(req: Request, res: Response) {
		const conversationId = new mongoose.Types.ObjectId(req.params.conversationId);
		const conversation = await this.conversationService.findConversation({ _id: conversationId });
		if (conversation?._id) {
			let foundMessages = await this.messageService.getMessage(conversation._id);
			return res.status(foundMessages.status).send(foundMessages);
		}
		return res.send(messages.internalError("Conversation doesn't exist"));
	}
}

export default MessageController;

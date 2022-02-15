import MessageModel from "../models/message.model";
import { messages } from "../messages";
import mongoose from "mongoose";

export default class MessageService {
	async createMessage(sender: string, message: string, conversationId: mongoose.Types.ObjectId) {
		const createMessage = await MessageModel.create({
			sender: sender,
			message: message,
			conversationId: conversationId,
		});
		return messages.successMessage("Message is created", "message", createMessage);
	}

	async getMessage(conversationId: mongoose.Types.ObjectId) {
		try {
			const response = await MessageModel.find({
				conversationId: conversationId,
			});
			return messages.createdMessage("Messages are found", "messages", response);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}
}

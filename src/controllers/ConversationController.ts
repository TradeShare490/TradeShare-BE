/* eslint-disable no-mixed-spaces-and-tabs */
import ConversationService from '../db/service/ConversationService'
import { Request, Response } from 'express'

class ConversationController {
    private conversationService: ConversationService;

    constructor () {
    	this.conversationService = new ConversationService()
    }

    async createConversation (req: Request, res: Response) {
    	const conversation = await this.conversationService.createConversation([req.body.sender, req.body.receiver])
    	return res.status(conversation.status).send(conversation)
    }

    async getConversations (req: Request, res: Response) {
    	const conversations = await this.conversationService.getConversations(req.params.username)
    	return res.status(conversations.status).send(conversations)
    }

    async deleteConversation (req: Request, res: Response) {
    	const response = await this.conversationService.deleteConversation(req.params.id)
    	return res.status(response.status).send(response)
    }
}

export default ConversationController

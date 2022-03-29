import MessageModel from '../models/message.model'
import { messages } from '../messages'
import mongoose from 'mongoose'
import NotificationsService from '../../modules/notifications/NotificationsService'
import ConversationService from './ConversationService'
import UserService from './UserService'
import UserCollection from '../models/user.model'

export default class MessageService {
	private notificationService: NotificationsService
	private conversationService: ConversationService
	private userService: UserService
	constructor () {
		this.notificationService = new NotificationsService()
		this.conversationService = new ConversationService()
		this.userService = new UserService(UserCollection)
	}

	async createMessage (sender: string, message: string, conversationId: mongoose.Types.ObjectId) {
		const createMessage = await MessageModel.create({
			sender: sender,
			message: message,
			conversationId: conversationId
		})
		const conversation = await this.conversationService.findConversation({ _id: conversationId })
		const members = conversation?.members
		for (const m of members) {
			if (m !== sender) {
				const uId = (await this.userService.getUser({ username: m })).user._id.toJSON()
				await this.notificationService.notify(uId, sender + ' sent you a new message', 'message')
			}
		}
		return messages.createdMessage('Message is created', 'createdMessage', createMessage)
	}

	async getMessage (conversationId: mongoose.Types.ObjectId) {
		try {
			const response = await MessageModel.find({
				conversationId: conversationId
			})
			return messages.successMessage('Messages are found', 'messages', response)
		} catch (error: any) {
			return messages.internalError(error.message)
		}
	}
}

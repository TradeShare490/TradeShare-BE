import ConversationModel, { Conversation } from '../models/conversation.model'
import { FilterQuery, QueryOptions, UpdateQuery } from 'mongoose'
import { messages } from '../messages'

export default class ConversationService {
	async createConversation (members: Array<string>) {
		try {
			const conversation = await ConversationModel.create({ members: members })
			return messages.successMessage('Conversation is created', 'conversation', conversation)
		} catch (error: any) {
			return messages.internalError(error.message)
		}
	}

	async getConversations (member: string) {
		try {
			const conversations = await ConversationModel.find({
				members: { $in: [member] }
			})
			return messages.successMessage('Conversations are found', 'conversations', conversations)
		} catch (error: any) {
			return messages.internalError(error.message)
		}
	}

	async findConversation (query: FilterQuery<Conversation>) {
		try {
			return await ConversationModel.findOne(query)
		} catch (error: any) {
			/* istanbul ignore next  */
			return messages.internalError(error.message)
		}
	}

	async updateConversation (
		query: FilterQuery<Conversation>,
		update: UpdateQuery<Conversation>,
		options: QueryOptions
	) {
		try {
			return await ConversationModel.findOneAndUpdate(query, update, options)
		} catch (error: any) {
			/* istanbul ignore next */
			return messages.internalError(error.message)
		}
	}

	async deleteConversation (id: string) {
		try {
			const response = await ConversationModel.deleteOne({
				_id: id
			})
			return messages.successMessage('Conversation deleted', 'deletedCount', response.deletedCount)
		} catch (error: any) {
			return messages.internalError(error.message)
		}
	}
}

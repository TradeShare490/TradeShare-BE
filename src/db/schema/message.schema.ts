import { object, string } from 'zod'

export const createMessageSchema = object({
	body: object({
		sender: string({
			required_error: 'sender is required'
		}),
		message: string({
			required_error: 'message is required'
		}),
		conversationId: string({
			required_error: 'Conversation ID is required'
		})
	})
})

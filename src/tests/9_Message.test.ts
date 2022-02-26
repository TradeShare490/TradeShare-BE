import { expect } from 'chai'
import { Conversation } from '../db/models/conversation.model'
import ConversationService from '../db/service/ConversationService'
import MessageService from '../db/service/MessageService'

describe('Message service can', () => {
	let conversationService: ConversationService
	let mockedConversation: Conversation
	let messageService: MessageService
	it('be setup', async () => {
		conversationService = new ConversationService()
		messageService = new MessageService()
		expect(messageService).not.equal(undefined)
		const response = await conversationService.createConversation(['user1', 'user2'])
		mockedConversation = response.conversation
	})

	it('create a new message', async () => {
		const response = await messageService.createMessage('user1', 'abcdef', mockedConversation._id)
		expect(response).to.have.property('message')
		expect(response.status).equals(201)
		expect(response.success).equals(true)
		expect(response.createdMessage.conversationId).equals(mockedConversation._id)
		expect(response.createdMessage.message).equals('abcdef')
	})

	it('get messages by conversationId', async () => {
		const response = await messageService.getMessage(mockedConversation._id)
		expect(response.status).equals(200)
		expect(response.success).equals(true)
	})
})

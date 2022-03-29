import { expect } from 'chai'
import { Conversation } from '../db/models/conversation.model'
import ConversationService from '../db/service/ConversationService'
import MessageService from '../db/service/MessageService'
import NotificationsService from '../modules/notifications/NotificationsService'
import FollowService from '../modules/follows/FollowService'
import UserService from '../db/service/UserService'
import UserCollection from '../db/models/user.model'

describe('Message service can', () => {
	let conversationService: ConversationService
	let mockedConversation: Conversation
	let messageService: MessageService
	let notificationsService: NotificationsService
	let userService: UserService
	let followService: FollowService
	let uId: string

	it('be setup', async () => {
		conversationService = new ConversationService()
		messageService = new MessageService()
		expect(messageService).not.equal(undefined)
		notificationsService = new NotificationsService()
		expect(notificationsService).not.equal(undefined)
		userService = new UserService(UserCollection)
		expect(userService).not.equal(undefined)
		followService = new FollowService()
		expect(followService).not.equal(undefined)
		const response = await conversationService.createConversation(['user2', 'user1'], ['User 2', 'User 1'])
		uId = (await userService.getUser({ username: 'user1' })).user._id.toJSON()
		mockedConversation = response.conversation
	})

	it('create a new message', async () => {
		const response = await messageService.createMessage('user2', 'abcdef', mockedConversation._id)
		expect(response).to.have.property('message')
		expect(response.status).equals(201)
		expect(response.success).equals(true)
		expect(response.createdMessage.conversationId).equals(mockedConversation._id)
		expect(response.createdMessage.message).equals('abcdef')
	})

	it('sends notification', async () => {
		const result = await notificationsService.getNotifications(uId)
		expect(result.data.notifications.length).equal(1)
	})

	it('get messages by conversationId', async () => {
		const response = await messageService.getMessage(mockedConversation._id)
		expect(response.status).equals(200)
		expect(response.success).equals(true)
	})

	describe('clean up the test suite', () => {
		it('delete mocked nodes', async () => {
			// Delete the mocked nodes

			const tobeDeletedIDs = [
				uId
			]
			for (const id of tobeDeletedIDs) {
				const nodeDeleteRes = await followService.deleteUserNode(id)
				expect(nodeDeleteRes.success).to.be.true
				expect(nodeDeleteRes.data).equal(1) // number of node deleted
			}
		})
	})
})

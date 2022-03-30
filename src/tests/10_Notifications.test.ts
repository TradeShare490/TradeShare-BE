import { expect } from 'chai'
import UserService from '../db/service/UserService'
import UserInfoService from '../db/service/UserInfoService'
import NotificationsService, { NotificationTypes } from '../modules/notifications/NotificationsService'
import FollowService from '../modules/follows/FollowService'
import UserCollection, { UserDocument } from '../db/models/user.model'
import UserInfoCollection, { UserInfo } from '../db/models/userInfo.model'

import { cleanupMockedUserInfo, createAndTestUserInfo } from './2_UserInfo.test'
import { generateRandomPassword } from '../utils/utils'

interface MockedUser {
	mockedUser: UserDocument;
	mockedInfo: UserInfo;
}

describe('Notifications service can', () => {
	let notificationsService: NotificationsService
	let followService: FollowService
	let mockedUser: MockedUser
	let testNotificationID: string
	let userService: UserService
	let userInfoService: UserInfoService

	describe('setup', () => {
		it('instantiate the service class', () => {
			notificationsService = new NotificationsService()
			expect(notificationsService).not.equal(undefined)
		})

		it('create prerequesite services', () => {
			followService = new FollowService()
			expect(followService).not.equal(undefined)
			userService = new UserService(UserCollection)
			userInfoService = new UserInfoService(UserInfoCollection)
			expect(userService).not.equal(undefined)
			expect(userInfoService).not.equal(undefined)
		})

		it('create mocked user', async () => {
			const mockedUserInput = {
				createUserInput: {
					email: 'mocked@email.com',
					password: await generateRandomPassword(),
					username: 'mockedUser'
				},
				createInfoInput: {
					firstname: 'Mocked',
					lastname: 'User',
					email: 'mocked@email.com',
					username: 'mockedUser'
				}
			}

			mockedUser = await createAndTestUserInfo({
				createUserInfoInput: mockedUserInput.createInfoInput,
				createUserInput: mockedUserInput.createUserInput,
				userInfoService: userInfoService,
				userService: userService
			})
		})
	})

	describe('create a new notification', () => {
		it('creates', async () => {
			const result = await notificationsService.notify(
				mockedUser.mockedInfo.userId.toJSON(), 'test notification', 'follow'
			)
			if (result.success) {
				testNotificationID = result.data.id
			}
			expect(result.success).to.be.true
		})
	})

	describe('mark a notification as read', () => {
		it('marks read', async () => {
			const result = await notificationsService.markNotificationRead(
				mockedUser.mockedInfo.userId.toJSON(), testNotificationID
			)
			expect(result.success).to.be.true
		})
	})

	describe('get a list of notifications for a user', () => {
		it('gets notifications', async () => {
			const result = await notificationsService.getNotifications(
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.data.notifications.length).equal(1)
		})
	})

	describe('disable and enable notifications', () => {
		it('disable notification', async () => {
			const result = await notificationsService.manageNotifications(
				mockedUser.mockedInfo.userId.toString(),
				[{ type: NotificationTypes.follow, enable: false }]
			)
			expect(result.success).to.be.true
			expect(result.message).equal('disabled')
		})
		it('cannot send disable notification type', async () => {
			await notificationsService.notify(
				mockedUser.mockedInfo.userId.toJSON(), 'test disabled notification', NotificationTypes.follow
			)
			const result = await notificationsService.getNotifications(
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.data.notifications.length).equal(1)
		})
		it('enable notification', async () => {
			const result = await notificationsService.manageNotifications(
				mockedUser.mockedInfo.userId.toString(),
				[{ type: NotificationTypes.follow, enable: true }]
			)
			expect(result.success).to.be.true
			expect(result.message).equal('enabled')
		})
		it('can send re-enabled notification type', async () => {
			await notificationsService.notify(
				mockedUser.mockedInfo.userId.toJSON(), 'test re-enabled notification', NotificationTypes.follow
			)
			const result = await notificationsService.getNotifications(
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.data.notifications.length).equal(2)
		})
	})

	describe('clean up the test suite', () => {
		it('delete mocked user', async () => {
			// delete the mocked user
			await cleanupMockedUserInfo({
				mockedUserId: mockedUser.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService
			})
		})
	})
})

import { expect } from 'chai'
import UserService from '../db/service/UserService'
import UserInfoService from '../db/service/UserInfoService'
import NotificationsService from '../modules/notifications/NotificationsService'
import FollowService from '../modules/follows/FollowService'
import UserCollection, { UserDocument } from '../db/models/user.model'
import UserInfoCollection, { UserInfo } from '../db/models/userInfo.model'

import { cleanupMockedUserInfo, createAndTestUserInfo } from './2_UserInfo.test'
import { generateRandomPassword } from '../utils/utils'

interface MockedUser {
	mockedUser: UserDocument;
	mockedInfo: UserInfo;
}

describe.only('Notifications service can', () => {
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
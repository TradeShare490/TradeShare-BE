import { expect } from 'chai'
import UserService from '../db/service/UserService'
import UserInfoService from '../db/service/UserInfoService'
import FollowService from '../modules/follows/FollowService'
import UserCollection, { UserDocument } from '../db/models/user.model'
import UserInfoCollection, { UserInfo } from '../db/models/userInfo.model'
import NotificationsService from '../modules/notifications/NotificationsService'

import { cleanupMockedUserInfo, createAndTestUserInfo } from './2_UserInfo.test'
import { generateRandomPassword } from '../utils/utils'

export interface MockedUser {
	mockedUser: UserDocument;
	mockedInfo: UserInfo;
}

describe('Follow service can', () => {
	let followService: FollowService
	let mockedFollower: MockedUser
	let mockedUser: MockedUser
	let userService: UserService
	let userInfoService: UserInfoService
	let notificationsService: NotificationsService
	let notificationRel: string

	describe('setup', () => {
		it('instantiate the service class', () => {
			followService = new FollowService()
			notificationsService = new NotificationsService()
			expect(followService).not.equal(undefined)
		})

		it('create prerequesite services', () => {
			userService = new UserService(UserCollection)
			userInfoService = new UserInfoService(UserInfoCollection)
			expect(userService).not.equal(undefined)
			expect(userInfoService).not.equal(undefined)
		})

		it('create two mocked users', async () => {
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

			const mockedFollowerInput = {
				createUserInput: {
					email: 'mockedFollower@email.com',
					password: await generateRandomPassword(),
					username: 'mockedFollower'
				},
				createInfoInput: {
					firstname: 'Mocked',
					lastname: 'Follower',
					email: 'mockedFollower@email.com',
					username: 'mockedFollower'
				}
			}

			mockedFollower = await createAndTestUserInfo({
				createUserInfoInput: mockedFollowerInput.createInfoInput,
				createUserInput: mockedFollowerInput.createUserInput,
				userInfoService: userInfoService,
				userService: userService
			})

			mockedUser = await createAndTestUserInfo({
				createUserInfoInput: mockedUserInput.createInfoInput,
				createUserInput: mockedUserInput.createUserInput,
				userInfoService: userInfoService,
				userService: userService
			})
		})
	})

	describe('follow users', () => {
		it('follow another user', async () => {
			// mockedFollower sends request to mockedUser
			const result = await followService.follow(
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			notificationRel = result.data.relId.toString()
			expect(result.success).to.be.true
		})

		it('prevent duplicate request', async () => {
			// mockedFollower sends request to mockedUser
			const result = await followService.follow(
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.success).to.be.false
		})

		it('detect invalid userID', async () => {
			// mockedFollower sends request to mockedUser
			const result = await followService.follow(123, { id: 'object type id' })
			expect(result.success).to.be.false
		})

		it('target user receives notification', async () => {
			const result = await notificationsService.getNotifications(
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.data.notifications.length).equal(1)
		})

		it.skip('recevie notification if the profile is private', () => {
			// mockedUser gets notification if profile is private; public by default
			// only do public requests for now
		})

		it.skip('follow request is pending if the profile is private', () => {
			// the service searches for the relationship, the relationship should have status as "pending"
			// look for status as 1 direction
			// only do public requests for now
		})
	})

	describe('get list of follows/followers for a user by userId', () => {
		it('get list of followers', async () => {
			// mockedUser get list of followers
			const result = await followService.getFollowers(mockedUser.mockedInfo.userId.toJSON())
			expect(result.success).to.be.true
			expect(result.data).to.be.an('array')
			expect(result.data[0]).equal(mockedFollower.mockedInfo.userId.toJSON())
		})

		it('get list of followings', async () => {
			// mockedFollower get list of followings
			const result = await followService.getFollows(mockedFollower.mockedInfo.userId.toJSON())
			expect(result.success).to.be.true
			expect(result.data).to.be.an('array')
			expect(result.data[0]).equal(mockedUser.mockedInfo.userId.toJSON())
		})
	})

	describe('unfollow users', () => {
		it('unfollow another user', async () => {
			// mockedFollower unfollow mockedUser, check list of followings
			const unfollowRes = await followService.unFollow(
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(unfollowRes.success).to.be.true
			expect(unfollowRes.data.numbDeleted).to.be.greaterThan(0) // number of relationship deleted

			// double check
			const isFollowed = await followService.verifyRelFollows(
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(isFollowed).to.be.false
		})
	})

	describe('clean up the test suite', () => {
		it('delete mocked user', async () => {
			// delete the mocked users
			await cleanupMockedUserInfo({
				mockedUserId: mockedUser.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService
			})
		})

		it('delete mocked follower', async () => {
			await cleanupMockedUserInfo({
				mockedUserId: mockedFollower.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService
			})
		})

		it('delete mocked nodes', async () => {
			// Delete the mocked nodes

			const tobeDeletedIDs = [
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			]
			for (const id of tobeDeletedIDs) {
				const nodeDeleteRes = await followService.deleteUserNode(id)
				expect(nodeDeleteRes.success).to.be.true
				expect(nodeDeleteRes.data).equal(1) // number of node deleted
			}
		})
	})
})

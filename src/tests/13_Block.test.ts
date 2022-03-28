import { expect } from 'chai'
import UserService from '../db/service/UserService'
import UserInfoService from '../db/service/UserInfoService'
import BlockService from '../modules/blocking/BlockService'
import UserCollection, { UserDocument } from '../db/models/user.model'
import UserInfoCollection, { UserInfo } from '../db/models/userInfo.model'

import { cleanupMockedUserInfo, createAndTestUserInfo } from './2_UserInfo.test'
import { generateRandomPassword } from '../utils/utils'

export interface MockedUser {
	mockedUser: UserDocument;
	mockedInfo: UserInfo;
}

describe('Block service can', () => {
	let blockService: BlockService
	let mockedBlocker: MockedUser
	let mockedUser: MockedUser
	let userService: UserService
	let userInfoService: UserInfoService

	describe('setup', () => {
		it('instantiate the service class', () => {
			blockService = new BlockService()
			expect(blockService).not.equal(undefined)
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

			const mockedBlockerInput = {
				createUserInput: {
					email: 'mockedBlocker@email.com',
					password: await generateRandomPassword(),
					username: 'mockedBlocker'
				},
				createInfoInput: {
					firstname: 'Mocked',
					lastname: 'Follower',
					email: 'mockedBlocker@email.com',
					username: 'mockedBlocker'
				}
			}

			mockedBlocker = await createAndTestUserInfo({
				createUserInfoInput: mockedBlockerInput.createInfoInput,
				createUserInput: mockedBlockerInput.createUserInput,
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
			// mockedBlocker sends request to mockedUser
			const result = await blockService.blockUser(
				mockedBlocker.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.success).to.be.true
		})

		it('prevent duplicate request', async () => {
			// mockedBlocker sends request to mockedUser
			const result = await blockService.blockUser(
				mockedBlocker.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(result.success).to.be.false
		})

		it('detect invalid userID', async () => {
			// mockedBlocker sends request to mockedUser
			const result = await blockService.blockUser(123, { id: 'object type id' })
			expect(result.success).to.be.false
		})
	})

	describe('get list of blocked users for a user by userId', () => {
		it('get list of blocked users', async () => {
			// mockedBlocker get list of blockedUsers
			const result = await blockService.getBlockedUsers(mockedBlocker.mockedInfo.userId.toJSON())
			expect(result.success).to.be.true
			expect(result.data).to.be.an('array')
			expect(result.data[0]).equal(mockedUser.mockedInfo.userId.toJSON())
		})
	})

	describe('unblock users', () => {
		it('unblock another user', async () => {
			// mockedBlocker unblocks mockedUser, check list of followings
			const unblockRes = await blockService.unblockUser(
				mockedBlocker.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(unblockRes.success).to.be.true
			expect(unblockRes.data.numbDeleted).to.be.greaterThan(0) // number of relationship deleted

			// double check
			const isBlocked = await blockService.verifyRelBlocks(
				mockedBlocker.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			)
			expect(isBlocked).to.be.false
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

		it('delete mocked blocker', async () => {
			await cleanupMockedUserInfo({
				mockedUserId: mockedBlocker.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService
			})
		})

		it('delete mocked nodes', async () => {
			// Delete the mocked nodes
			const tobeDeletedIDs = [
				mockedBlocker.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			]
			for (const id of tobeDeletedIDs) {
				const nodeDeleteRes = await blockService.deleteUserNode(id)
				expect(nodeDeleteRes.success).to.be.true
				expect(nodeDeleteRes.data).equal(1) // number of node deleted
			}
		})
	})
})

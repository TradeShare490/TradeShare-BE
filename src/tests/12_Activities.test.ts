import { expect } from 'chai'
import AlpacaService from '../db/service/AlpacaService'
import UserInfoService from '../db/service/UserInfoService'
import UserService from '../db/service/UserService'
import ActivityService, { AlpacaActivity } from '../modules/newsfeed/ActivityService'
import { generateRandomPassword } from '../utils/utils'
import { cleanupMockedUserInfo, createAndTestUserInfo } from './2_UserInfo.test'
import UserCollection from '../db/models/user.model'
import UserInfoCollection from '../db/models/userInfo.model'
import { MockedUser } from './7_Follow.test'
import FollowService from '../modules/follows/FollowService'

describe('Activities service can', () => {
	let activityService: ActivityService
	let alpacaService: AlpacaService
	let userService: UserService
	let userInfoService: UserInfoService
	const alpacaToken = '75320e3b-f7db-4d32-81e1-58b30d7a34bb'
	let mockUser:MockedUser
	let alpacaActivities: AlpacaActivity[]
	let lastAlpacaFetchId: string
	let storedActivities: AlpacaActivity&{identity: string}[]

	it('be set up', async () => {
		alpacaService = new AlpacaService()
		activityService = new ActivityService()
		userService = new UserService(UserCollection)
		userInfoService = new UserInfoService(UserInfoCollection)

		expect(alpacaService).not.equal(undefined)
		expect(activityService).not.equal(undefined)

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

		mockUser = await createAndTestUserInfo({
			createUserInfoInput: mockedUserInput.createInfoInput,
			createUserInput: mockedUserInput.createUserInput,
			userInfoService: userInfoService,
			userService: userService
		})

		// update format of userId and alpacaToken
		mockUser.mockedInfo.alpacaToken = alpacaToken
		mockUser.mockedInfo.userId = mockUser.mockedInfo.userId.toJSON()
	})

	it('get activities info from alpaca', async () => {
		const response = await alpacaService.getInfo(
			'/account/activities/FILL',
			'activities',
			alpacaToken
		)
		expect(response.status).equals(200)
		expect(response.success).equals(true)
		expect(response.message).equals('success')
		expect(response.activities).to.be.an('Array')
		alpacaActivities = response.activities
	})

	it('get the last activity id fetched from Alpaca', async () => {
		const result = await ActivityService.collectLastFetchedId(mockUser.mockedInfo)
		expect(result).equal('') // new user, empty id
		lastAlpacaFetchId = result
	})

	it('detect and import new activities from Alpaca API', () => {
		const result = ActivityService.filterNewActivities(lastAlpacaFetchId, alpacaActivities)
		expect(result.length).equal(alpacaActivities.length)
	})

	it('create new activity nodes', async () => {
		const result = await ActivityService.createNodes(mockUser.mockedInfo, alpacaActivities)
		expect(result).not.equal(undefined)
		if (result) {
			expect(result.success).to.be.true
			expect(result.data[0].get('noError')).to.be.true

			// verify
			const lastFetchedId = await ActivityService.collectLastFetchedId(mockUser.mockedInfo)
			expect(lastFetchedId).not.equal(lastAlpacaFetchId)
			expect(lastFetchedId).equal(alpacaActivities[0].id)
		}
	})

	it('get nodes by userId', async () => {
		const result = await ActivityService.getNodesByUserId(mockUser.mockedInfo.userId)
		expect(result.data.length).equal(alpacaActivities.length)
		expect(result.success).to.be.true
		storedActivities = result.data
	})

	describe('cleanup', () => {
		it('delete mocked user', async () => {
			await cleanupMockedUserInfo({
				mockedUserId: mockUser.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService
			})
		})

		it('delete activities', async () => {
			const ids = storedActivities.map(el => el.identity)
			const result = await ActivityService.deleteNodes(ids)
			expect(result.success).to.be.true
			expect(result.data.numDeleted).to.equal(ids.length)
		})

		it('delete mocked nodes', async () => {
			const followService = new FollowService()
			const nodeDeleteRes = await followService.deleteUserNode(mockUser.mockedInfo.userId)
			expect(nodeDeleteRes.success).to.be.true
			expect(nodeDeleteRes.data).equal(1) // number of node deleted
		})
	})
})

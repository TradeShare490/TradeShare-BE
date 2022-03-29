import UserInfoCollection, { UserInfo } from '../../db/models/userInfo.model'
import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import UserInfoService from '../../db/service/UserInfoService'
import { followQueries } from './FollowQueries'
import mongoose from 'mongoose'
import neo4j, { Record } from 'neo4j-driver'
import NotificationsService from '../notifications/NotificationsService'
import Neo4JHelper from '../utils/Neo4JHelper'

class FollowService extends Neo4JHelper {
	private userInfoService: UserInfoService;
	private notificationsService: NotificationsService
	constructor () {
		super()
		this.userInfoService = new UserInfoService(UserInfoCollection)
		this.notificationsService = new NotificationsService()
	}

	/**
	 * Set up relationship `Follows`
	 * @param srcUserId ID of the actor
	 * @param targetUserId ID of the target
	 * @returns Returns error if `Follows` already exists. Else , {data: {numOfPath, relId } }
	 */
	async follow (srcUserId: UserInfo['userId'], targetUserId: UserInfo['userId'], bypassPrivate = false) {
		// cannot follow yourself
		if (srcUserId === targetUserId) return { success: false, message: 'Cannot follow yourself', data: { relId: -1 } }

		// Check if the relationship already exist or not
		const relExists = await this.verifyRelFollows(srcUserId, targetUserId)

		// If exists, return error and message: "Already exists"
		if (relExists) {
			return { success: false, message: 'The actor already followed this user', data: { relId: -1 } }
		}

		// If does not exist, setup follow relationship between the two users
		try {
			// Get the profile visibility of the target user
			const targetUserMongoId = new mongoose.Types.ObjectId(targetUserId) // convert into MongoDB ID Object
			const targerUserInfo = await this.userInfoService.findUserInfo({
				userId: targetUserMongoId
			})

			const res = targerUserInfo?.isPrivate && !bypassPrivate
				? await this.createRelFollows(srcUserId, targetUserId, true)
				: await this.createRelFollows(srcUserId, targetUserId)

			// Notify target user if it is a private account
			if (targerUserInfo?.isPrivate && !bypassPrivate && res.success) {
				const notiMessage = `${srcUserId?.firstname} ${srcUserId?.lastname} has requested to follow you`
				await this.notificationsService.notify(targetUserId, notiMessage, 'followRequest')
			}

			return res
		} catch (error: any) {
			console.log(error.message)
			return { success: false, message: 'Invalid target userID', data: { relId: -1 } }
		}
	}

	/**
	 * Create a `Follows` relationship
	 * @param srcUserId
	 * @param targetUserId
	 * @param isPending whether this relationship requires approval, false by default
	 * @returns \{success; message; data: {numOfPath, relId } }
	 */
	async createRelFollows (
		srcUserId: UserInfo['userId'],
		targetUserId: UserInfo['userId'],
		isPending = false
	) {
		const query = followQueries.CREATE_RELATIONSHIP
		const params = {
			src: srcUserId,
			target: targetUserId,
			isPending: isPending
		}

		return this.createRel(query, params)
	}

	/**
	 * Verify if there is a `Follows` relationship between src and target user
	 * @param srcUserId
	 * @param targetUserId
	 * @returns true if there is, otherwise, false
	 */
	async verifyRelFollows (srcUserId: UserInfo['userId'], targetUserId: UserInfo['userId']) {
		const query = followQueries.GET_RELATIONSHION_BETWEEN_USERS
		const params = {
			src: srcUserId,
			target: targetUserId
		}
		const { success, data } = await neo4jInstance.runQueryInTransaction(
			query,
			params,
			QueryMode.read
		)

		return success && data && data[0].get('relExists')
	}

	/**
	 * Get the list of account_ids the user follows
	 * @param userId
	 * @returns \{success, message, data: list of followers' IDs}
	 */
	async getFollows (userId: UserInfo['userId']) {
		const query = followQueries.GET_FOLLOWS_FOR_USER
		const params = {
			userId: userId
		}
		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read)
		if (queryResponse.success && queryResponse.data.length > 0) {
			// update the return data
			const listOfUserIds = []
			// will receive an array of IDs which the user follows
			for (const record of queryResponse.data) {
				listOfUserIds.push(record.get('followId'))
			}

			return {
				success: true,
				message: queryResponse.message,
				data: listOfUserIds
			}
		} else {
			return queryResponse
		}
	}

	/**
	 * Get the list of account_ids who follow this user
	 * @param userId
	 * @returns \{success, message, data: ListOfFollowers}
	 */
	async getFollowers (userId: UserInfo['userId']) {
		const query = followQueries.GET_FOLLOWERS_FOR_USER
		const params = {
			userId: userId
		}
		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read)
		if (queryResponse.success && queryResponse.data.length > 0) {
			// update the return data
			const listOfUserIds = []
			// will receive an array of IDs which follows the user
			for (const record of queryResponse.data) {
				listOfUserIds.push(record.get('followerId'))
			}

			return {
				success: true,
				message: queryResponse.message,
				data: listOfUserIds
			}
		} else {
			return queryResponse
		}
	}

	/**
	 * Unfollow a user
	 * @param srcUserId ID of the actor
	 * @param targetUserId ID of the target
	 * @returns \{success, message, data: numbDeleted}
	 */
	unFollow (srcUserId: UserInfo['userId'], targetUserId: UserInfo['userId']) {
		return this.deleteRelFollows(srcUserId, targetUserId)
	}

	/**
	 * Decline a request
	 * @param srcUserId ID of the actor
	 * @param targetUserId ID of the target
	 * @returns \{success, message, data: numbDeleted}
	 */
	async declinePendingRequest (relId: number) {
		const query = followQueries.DELELTE_REQUEST_BY_ID
		const params = { relId }

		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			const numbDeleted = neo4j.integer.toNumber(queryResponse.data[0].get('numbDeleted'))
			return {
				success: true,
				message: queryResponse.message,
				data: { numbDeleted: numbDeleted }
			}
		} else {
			return queryResponse
		}
	}

	/**
	 * Accepting a request
	 * @param relId relationship ID / Request ID
	 * @returns
	 */
	acceptPendingRequest (relId: number) {
		return this.setPendingRequest(relId, false)
	}

	/**
	 * Return the status of the relationship
	 * @param relId
	 * @returns
	 */
	async getPendingRequests (userId: UserInfo['userId']) {
		const query = followQueries.GET_PENDING_REQUESTS_FOR_USER
		const params = {
			userId: userId
		}

		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read)
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			return {
				success: true,
				message: queryResponse.message,
				data: this.parseRequestFromNeo4j(queryResponse.data)
			}
		} else {
			return queryResponse
		}
	}

	/**
	 * Set a request to pending. This function is used in test to avoid creating unnecessary new request
	 * @param relId
	 * @returns
	 */
	async setPendingRequest (relId: number, isPending: boolean) {
		const query = followQueries.SET_PENDING_REQUEST
		const params = { relId, isPending }

		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			const numbModified = neo4j.integer.toNumber(queryResponse.data[0].get('numbModified'))
			return {
				success: true,
				message: queryResponse.message,
				data: { numbModified }
			}
		} else {
			return queryResponse
		}
	}

	parseRequestFromNeo4j (rows: Record[]) {
		const requestArr = []
		for (const row of rows) {
			requestArr.push({
				senderId: neo4j.integer.toNumber(row.get('senderId')),
				requestId: neo4j.integer.toNumber(row.get('relId'))
			})
		}
		return requestArr
	}

	/**
	 * Delete a `Follows` relationship between the two users
	 * @param srcUserId
	 * @param targetUserId
	 * @param isPending if true means cancelling a `follow` request, false by default. By default: unfollow
	 * @returns \{success, message, data: numbDeleted}
	 */
	async deleteRelFollows (
		srcUserId: UserInfo['userId'],
		targetUserId: UserInfo['userId'],
		isPending = false
	) {
		const query = followQueries.DELETE_RELATIONSHIP_BY_USER_ID
		const params = {
			src: srcUserId,
			target: targetUserId,
			isPending: isPending
		}

		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			const numbDeleted = neo4j.integer.toNumber(queryResponse.data[0].get('numbDeleted'))
			return {
				success: true,
				message: queryResponse.message,
				data: { numbDeleted: numbDeleted }
			}
		} else {
			return queryResponse
		}
	}

	/**
	 * Delete a user node after running tests
	 * @param userId
	 * @returns \{success, message, data: number of nodes deleted}
	 */
	async deleteUserNode (userId: UserInfo['userId']) {
		const query = followQueries.DELETE_USER_NODE_BY_ID
		const params = {
			userId: userId
		}

		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			const numbDeleted = neo4j.integer.toNumber(queryResponse.data[0].get('numbDeleted'))
			return {
				success: true,
				message: queryResponse.message,
				data: numbDeleted
			}
		} else {
			return queryResponse
		}
	}
}

export default FollowService

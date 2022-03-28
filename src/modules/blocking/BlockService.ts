import UserInfoCollection, { UserInfo } from '../../db/models/userInfo.model'
import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import UserInfoService from '../../db/service/UserInfoService'
import { blockQueries } from './BlockQueries'
import neo4j from 'neo4j-driver'
import Neo4JHelper from '../utils/Neo4JHelper'

class BlockService extends Neo4JHelper {
	private userInfoService: UserInfoService;
	constructor () {
		super()
		this.userInfoService = new UserInfoService(UserInfoCollection)
	}

	/**
	 * Set up relationship `Blocks`
	 * @param srcUserId ID of the actor
	 * @param targetUserId ID of the target
	 * @returns Returns error if `Blocks` already exists. Else , {data: {numOfPath, relId } }
	 */
	async blockUser (srcUserId: UserInfo['userId'], targetUserId: UserInfo['userId']) {
		// cannot block yourself
		if (srcUserId === targetUserId) return { success: false, message: 'Cannot block yourself' }

		// Check if the relationship already exist or not
		const relExists = await this.verifyRelBlocks(srcUserId, targetUserId)

		// If exists, return error and message: "Already exists"
		if (relExists) {
			return { success: false, message: 'The actor already blocks this user' }
		}

		// If does not exist, setup block relationship between the two users
		try {
			return await this.createRelBlocks(srcUserId, targetUserId)
		} catch (error: any) {
			console.log(error.message)
			return { success: false, message: 'Invalid target userID', data: {} }
		}
	}

	/**
	 * Create a `Block` relationship
	 * @param srcUserId
	 * @param targetUserId
	 * @returns \{success; message; data: {numOfPath, relId } }
	 */
	async createRelBlocks (
		srcUserId: UserInfo['userId'],
		targetUserId: UserInfo['userId']
	) {
		const query = blockQueries.CREATE_RELATIONSHIP
		const params = {
			src: srcUserId,
			target: targetUserId
		}
		return await this.createRel(query, params)
	}

	/**
	 * Verify if there is a `Blocks` relationship between src and target user
	 * @param srcUserId
	 * @param targetUserId
	 * @returns true if there is, otherwise, false
	 */
	async verifyRelBlocks (srcUserId: UserInfo['userId'], targetUserId: UserInfo['userId']) {
		const query = blockQueries.GET_RELATIONSHION_BETWEEN_USERS
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
	 * Get the list of account_ids the user blocks
	 * @param userId
	 * @returns \{success, message, data: list of blocked users' IDs}
	 */
	async getBlockedUsers (userId: UserInfo['userId']) {
		const query = blockQueries.GET_BLOCKS_FOR_USER
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
	 * Unblock a user
	 * @param srcUserId ID of the actor
	 * @param targetUserId ID of the target
	 * @returns \{success, message, data: numbDeleted}
	 */
	unblockUser (srcUserId: UserInfo['userId'], targetUserId: UserInfo['userId']) {
		return this.deleteRelBlocks(srcUserId, targetUserId)
	}

	/**
	 * Delete a `Blocks` relationship between the two users
	 * @param srcUserId
	 * @param targetUserId
	 * @returns \{success, message, data: numbDeleted}
	 */
	async deleteRelBlocks (
		srcUserId: UserInfo['userId'],
		targetUserId: UserInfo['userId']
	) {
		const query = blockQueries.DELETE_BLOCK_RELATIONSHIP_BY_USER_ID
		const params = {
			src: srcUserId,
			target: targetUserId
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
		const query = blockQueries.DELETE_USER_NODE_BY_ID
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

export default BlockService

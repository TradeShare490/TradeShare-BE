import { UserInfo } from '../../db/models/userInfo.model'
import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import { followQueries } from './FollowQueries'
import neo4j, { Record } from 'neo4j-driver'

class FollowRequestService {
	/**
	 * Decline a request
	 * @param relId ID of the request
	 * @returns \{success, message, data: numbDeleted}
	 */
	static async declinePendingRequest (relId: number) {
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
	static acceptPendingRequest (relId: number) {
		return FollowRequestService.setPendingRequest(relId, false)
	}

	/**
	 * Return the requests of the a user
	 * @param userId the user id
	 * @returns list of request
	 */
	static async getPendingRequests (userId: UserInfo['userId']) {
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
	static async setPendingRequest (relId: number, isPending: boolean) {
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

	static parseRequestFromNeo4j (rows: Record[]) {
		const requestArr = []
		for (const row of rows) {
			requestArr.push({
				senderId: row.get('senderId'),
				relId: neo4j.integer.toNumber(row.get('relId'))
			})
		}
		return requestArr
	}
}

export default FollowRequestService

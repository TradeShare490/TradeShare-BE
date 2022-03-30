/* eslint-disable camelcase */
import neo4j, { Record } from 'neo4j-driver'
import { UserInfo } from '../../db/models/userInfo.model'
import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import { ActivityNode, UserNode } from '../../db/neo4j/Neo4jSchema'
import { activityQueries } from './ActivityQueries'

export interface AlpacaActivity{
	id: string,
	activity_type: string,
	transaction_time: string,
	type: string,
	price: string,
	qty: string,
	side: string,
	symbol: string,
	leaves_qty: string,
	order_id: string,
	cum_qty: string,
	order_status: string
}

class ActivityService {
	/**
	 * Populate new activities into Neo4j
	 * @param userInfo
	 * @param data Array of acitivties from Alpaca
	 */
	static async fetchIntoNeo4j (userInfo: UserInfo, data: AlpacaActivity[]) {
		const currActIds = await ActivityService.collectLastFetchedId(userInfo)
		const unpopulatedActivities = ActivityService.filterNewActivities(currActIds, data)
		return ActivityService.createNodes(userInfo, unpopulatedActivities)
	}

	/**
	 * Collect the id of the last activity fetched from Alpaca
	 * @param userInfo
	 * @returns
	 */
	static async collectLastFetchedId (userInfo: UserInfo): Promise<string> {
		const query = activityQueries.GET_LAST_ACTIVITY_IN_NEO4J
		const params = { userId: userInfo.userId }
		// Get the list of postID, go check if there is a new one?
		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read)
		if (!queryResponse.success) {
			console.log(queryResponse.message)
			return ''
		}

		const row:Record = queryResponse.data[0] // there should be only one user for the given userId
		const lastFetchedAlpacaActivityId:UserNode['lastFetchedAlpacaActivityId'] = row.get('lastFetchedAlpacaActivityId')
		return lastFetchedAlpacaActivityId && lastFetchedAlpacaActivityId !== 'null' ? lastFetchedAlpacaActivityId : ''
	}

	static filterNewActivities (lastFetchedId: UserNode['lastFetchedAlpacaActivityId'], newData: AlpacaActivity[]) {
		const newActivities:AlpacaActivity[] = []
		for (const activity of newData) {
			if (activity.id === lastFetchedId) {
				break
			}

			newActivities.push(activity)
		}
		return newActivities
	}

	static async createNodes (userInfo: UserInfo, activities: AlpacaActivity[]) {
		const query = activityQueries.CREATE_NODE
		let res
		for (let i = activities.length - 1; i >= 0; i--) {
			const params = {
				userId: userInfo.userId,
				lastAlpacaFetch: new Date().toISOString(),
				lastFetchedAlpacaActivityId: activities[i].id,
				...convertToParams(activities[i])
			}

			res = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
			if (!res.success) {
				break
			}
		}

		return res
	}

	static async deleteNodes (nodeIds: ActivityNode['alpacaId'][]) {
		const query = activityQueries.DELETE_NODES
		const params = {
			ids: nodeIds
		}
		const res = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
		if (res.success) {
			res.data = { numDeleted: neo4j.integer.toNumber(res.data[0].get('numDeleted')) }
		}

		return res
	}

	static async getNodesByUserId (userId: UserInfo['userId']) {
		const query = activityQueries.GET_ALL_ACTIVITIES_FOR_USER
		const params = {
			userId: userId
		}
		const res = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read)
		if (res.success) {
			res.data = convertToObjects(res.data)
		}

		return res
	}
}

export default ActivityService

const convertToParams = (activty: AlpacaActivity) => {
	return {
		alpacaId: activty.id,
		activity_type: activty.activity_type,
		transaction_time: activty.transaction_time,
		type: activty.type,
		price: activty.price,
		qty: activty.qty,
		side: activty.side,
		symbol: activty.symbol,
		leaves_qty: activty.leaves_qty,
		order_id: activty.order_id,
		cum_qty: activty.cum_qty,
		order_status: activty.order_status
	}
}

const convertToObjects = (data: Record[]) => {
	const objs:ActivityNode[] = []
	for (const rec of data) {
		const activity = rec.get('Activity')
		activity.id = neo4j.integer.toNumber(activity.identity)
		objs.push(activity)
	}
	return objs
}

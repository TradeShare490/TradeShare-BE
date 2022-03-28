import { UserInfo } from '../../db/models/userInfo.model'
import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import neo4j from 'neo4j-driver'

class Neo4JHelper {
	async createRel (
		query: string,
		params: any
	) {
		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			const numOfPath = neo4j.integer.toNumber(queryResponse.data[0].get('numOfPath'))
			const relId = neo4j.integer.toNumber(queryResponse.data[0].get('relId'))
			return {
				success: true,
				message: queryResponse.message,
				data: { numOfPath: numOfPath, relId: relId }
			}
		} else {
			return queryResponse
		}
	}
}

export default Neo4JHelper

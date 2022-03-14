export const activityQueries = {
	GET_LAST_ACTIVITY_IN_NEO4J: `
        MERGE (n:User{userId:$userId}) return n.lastFetchedAlpacaActivityId as lastFetchedAlpacaActivityId
    `,
	CREATE_NODE: `
        MATCH (n:User{userId: $userId})
        WITH n
        CREATE (a: Activity{alpacaId: $alpacaId,
            activity_type: $activity_type,
            transaction_time: $transaction_time,
            type: $type,
            price: $price,
            qty: $qty,
            side: $side,
            symbol: $symbol,
            leaves_qty: $leaves_qty,
            order_id: $order_id,
            cum_qty: $cum_qty,
            order_status: $order_status}
            )
        MERGE (n)-[r:Writes]->(a)
        SET n.lastFetchedAlpacaActivityId = $lastFetchedAlpacaActivityId
        SET n.lastAlpacaFetch = $lastAlpacaFetch
        RETURN true as noError
    `,
	DELETE_NODES: `
        MATCH (n:Activity) 
        WHERE ID(n) IN $ids
        DETACH DELETE n
        RETURN COUNT(n) as numDeleted
    `,
	GET_ALL_ACTIVITIES_FOR_USER: `
        MATCH (n:User{userId: $userId})-[r:Writes]->(m:Activity)
        RETURN m as Activity
    `

}

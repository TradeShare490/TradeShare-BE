export const followQueries = {
	CREATE_RELATIONSHIP: `
                MERGE (src: User{userId: $src})
                MERGE (target: User{userId: $target})
                MERGE p=(src)-[r:Follows{isPending: $isPending}]->(target)
                return count(p) as numOfPath, ID(r) as relId
        `,
	GET_RELATIONSHION_BETWEEN_USERS: `
                MATCH p=(src: User{userId: $src})-[r:Follows]->(target: User{userId: $target})
                WITH p
                RETURN 
                CASE 
                WHEN count(p)>0 then true
                ELSE false
                END AS relExists
        `,
	GET_FOLLOWS_FOR_USER: `
                MATCH (n:User{userId: $userId})-[r:Follows{isPending: false}]->(m:User)
                RETURN m.userId as followId
        `,
	GET_FOLLOWERS_FOR_USER: `
                MATCH (n:User)-[r:Follows{isPending: false}]->(m:User{userId: $userId})
                RETURN n.userId as followerId
        `,
	DELETE_RELATIONSHIP_BY_USER_ID: `
                MATCH (src: User{userId: $src})-[r:Follows{isPending:$isPending}]->(target: User{userId: $target})
                DELETE r
                RETURN COUNT(*) as numbDeleted
        `,
	DELETE_USER_NODE_BY_ID: `
                MATCH (n:User{userId: $userId})
                DETACH DELETE n
                RETURN COUNT(*) as numbDeleted                 
        `,
	SET_PENDING_REQUEST: `
                MATCH (src:User)-[r:Follows]->(target: User)
                WHERE ID(r) = $relId
                SET r.isPending = $isPending
                RETURN COUNT(*) as numbModified 
        `,
	GET_PENDING_REQUESTS_FOR_USER: `
                MATCH (n:User)-[r:Follows{isPending: true}]->(m:User{userId: $userId})
                RETURN n.userId as senderId, ID(r) as relId
        `,
	DELELTE_REQUEST_BY_ID: `
                MATCH (src:User)-[r:Follows]->(target: User)
                WHERE ID(r) = $relId
                DELETE r
                RETURN COUNT(*) as numbDeleted 
        `
}

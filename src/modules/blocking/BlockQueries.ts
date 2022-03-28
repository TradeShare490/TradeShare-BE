export const blockQueries = {
	CREATE_RELATIONSHIP: `
                MERGE (src: User{userId: $src})
                MERGE (target: User{userId: $target})
                MERGE p=(src)-[r:Blocks]->(target)
                return count(p) as numOfPath, ID(r) as relId
        `,
	GET_RELATIONSHION_BETWEEN_USERS: `
                MATCH p=(src: User{userId: $src})-[r:Blocks]->(target: User{userId: $target})
                WITH p
                RETURN 
                CASE 
                WHEN count(p)>0 then true
                ELSE false
                END AS relExists
        `,
	GET_BLOCKS_FOR_USER: `
                MATCH (n:User{userId: $userId})-[r:Blocks]->(m:User)
                RETURN m.userId as followId
        `,
	DELETE_BLOCK_RELATIONSHIP_BY_USER_ID: `
                MATCH (src: User{userId: $src})-[r:Blocks]->(target: User{userId: $target})
                DELETE r
                RETURN COUNT(*) as numbDeleted
        `,
	DELETE_USER_NODE_BY_ID: `
                MATCH (n:User{userId: $userId})
                DELETE n
                RETURN COUNT(*) as numbDeleted 
                
        `
}

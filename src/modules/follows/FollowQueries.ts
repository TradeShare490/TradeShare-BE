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
	GET_FOLLOWS_FOR_USER: ``,
	GET_FOLLOWERS_FOR_USER: ``,
};

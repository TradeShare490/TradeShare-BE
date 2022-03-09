export const notificationsQueries = {
    CREATE_RELATIONSHIP: `
                MERGE (src: User{userId: $src})
                MERGE (target: User{userId: $target})
                MERGE p=(src)-[r:Follows{isPending: $isPending}]->(target)
                return count(p) as numOfPath, ID(r) as relId
        `,
    GET_NOTIFICATIONS_FOR_USER: `
                MATCH (n:User{userId: $userId})-[r:Follows{isPending: false}]->(m:User)
                RETURN m.userId as followId
        `,
    DELETE_NOTIFICATION_NODE_BY_ID: `
                MATCH (n:Notification{notificationId: $notificationId})
                DELETE n
                RETURN COUNT(*) as numbDeleted 
                
        `
}

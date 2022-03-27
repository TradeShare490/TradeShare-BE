export const notificationsQueries = {
        CREATE_RELATIONSHIP: `
                MERGE (user: User{userId: $user})
                MERGE (notif: Notification{content: $content, typeOfNotification: $typeOfNotification})
                MERGE p=(notif)-[r:Notifies{isRead: $isRead}]->(user)
                return count(p) as numOfPath, ID(r) as id
        `,
        GET_NOTIFICATIONS_FOR_USER: `
                MATCH (notif: Notification)-[r:Notifies]->(user: User{userId: $user})
                RETURN ID(notif) as notifId, collect(properties(notif)) as userNotifications
        `,
        DELETE_NOTIFICATION_NODE_BY_ID: `
                MATCH (n:Notification) where ID(n) = $notifId
                DELETE n
                RETURN COUNT(*) as numDeleted 
                
        `,
        MARK_NOTIFICATION_READ_BY_ID: `
                MATCH (notif: Notification)-[r:Notifies]->(user: User{userId: $user}) where ID(notif) = $notifId
                SET r.isRead = True
                RETURN COUNT(r) as numRead
        
        `,
        DELETE_REL_BY_ID: `
                MATCH (notif: Notification)-[r:Notifies]->(user: User) where ID(r) = $relId
                DELETE r
                RETURN COUNT(*) as numDeleted
        
        `
}

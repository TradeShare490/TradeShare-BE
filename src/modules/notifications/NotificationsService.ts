import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import UserInfoService from '../../db/service/UserInfoService'
import { notificationsQueries } from './NotificationsQueries'
import neo4j from 'neo4j-driver'
import { Interface } from 'readline'

class NotificationsService {
    /**
     * Set up relationship `notifies`
     * @param userId ID of the actor
     * @param content text content of the notification
     * @param typeOfNotification type of notification (follow, like, message etc.)
     * @returns Returns error if userId is not found. Else , {data: {numOfPath, relId } }
     */
    async notify(userId: String, content: String, typeOfNotification: String) {
        // TODO: check user's notification settings here
        return this.createRelNotifies(userId, content, typeOfNotification)
    }

    /**
     * Create a `Notifies` relationship
     * @param userId
     * @param content
     * @param typeOfNotification
     * @returns \{success; message; data: {numOfPath, relId } }
     */
    async createRelNotifies(
        userId: String,
        content: String,
        typeOfNotification: String
    ) {
        const query = notificationsQueries.CREATE_RELATIONSHIP
        const params = {
            user: userId,
            content: content,
            typeOfNotification: typeOfNotification,
            isRead: false
        }

        const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
        if (queryResponse.success && queryResponse.data[0]) {
            // field_name based on the RETURN in the query
            const numOfPath = neo4j.integer.toNumber(queryResponse.data[0].get('numOfPath'))
            const id = neo4j.integer.toNumber(queryResponse.data[0].get('id'))
            return {
                success: true,
                message: queryResponse.message,
                data: { numOfPath: numOfPath, id: id }
            }
        } else {
            return queryResponse
        }
    }

    /**
     * Mark a notification as read
     * @param notificationId
     * @returns true if the notification is now read, otherwise, false
     */
    async markNotificationRead(userId: String, notificationId: String) {
        const query = notificationsQueries.MARK_NOTIFICATION_READ_BY_ID
        const params = {
            user: userId,
            notifId: notificationId
        }

        const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
        if (queryResponse.success && queryResponse.data[0]) {
            // field_name based on the RETURN in the query
            const numRead = neo4j.integer.toNumber(queryResponse.data[0].get('numRead'))
            return {
                success: true,
                message: queryResponse.message,
                data: { numRead: numRead }
            }
        } else {
            return queryResponse
        }
    }

    /**
     * Get the list of notifications for a user
     * @param userId
     * @returns \{success, message, data: list of notifications}
     */
    async getNotifications(userId: String) {
        const query = notificationsQueries.GET_NOTIFICATIONS_FOR_USER
        const params = {
            user: userId
        }

        const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
        if (queryResponse.success && queryResponse.data[0]) {
            // field_name based on the RETURN in the query
            let notifs: any[]
            notifs = queryResponse.data[0].get('userNotifications')
            return {
                success: true,
                message: queryResponse.message,
                data: { notifications: notifs }
            }
        } else {
            return queryResponse
        }
    }

    /**
     * Delete a notification
     * @param notificationId ID of the notification
     * @returns \{success, message, data: numbDeleted}
     */
    async deteletNotificaiton(notificationId: String) {
        const query = notificationsQueries.DELETE_NOTIFICATION_NODE_BY_ID
        const params = {
            notifId: notificationId
        }

        const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
        if (queryResponse.success && queryResponse.data[0]) {
            // field_name based on the RETURN in the query
            const numDeleted = neo4j.integer.toNumber(queryResponse.data[0].get('numDeleted'))
            return {
                success: true,
                message: queryResponse.message,
                data: { numDeleted: numDeleted }
            }
        } else {
            return queryResponse
        }
    }

    /**
     * Delete a notification
     * @param notificationId ID of the notification
     * @returns \{success, message, data: numbDeleted}
     */
    async deteletNotificaitonRel(notificationId: String, userId: String) {
        const query = notificationsQueries.DELETE_REL_BY_ID
        const params = {
            notifId: notificationId,
            user: userId
        }

        const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write)
        if (queryResponse.success && queryResponse.data[0]) {
            // field_name based on the RETURN in the query
            const numDeleted = neo4j.integer.toNumber(queryResponse.data[0].get('numDeleted'))
            return {
                success: true,
                message: queryResponse.message,
                data: { numDeleted: numDeleted }
            }
        } else {
            return queryResponse
        }
    }

    /**
     * Manage notification preferences
     * @param notificationId ID of the notification
     * @returns \{success, message, data: numbDeleted}
     */
    manageNotifications(userId: String, notifications: any) {
        notifications.forEach((n: { id: String, enable: Boolean }) => {
            if (n.enable) {
                // enable preference in mongo
            } else {
                // disable preference in mongo
            }
        })
        return {
            success: true,
            message: 'test',
            data: 'test'
        }
    }
}

export default NotificationsService

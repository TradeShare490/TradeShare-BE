import neo4jInstance, { QueryMode } from '../../db/neo4j/Neo4jInstance'
import UserInfoService from '../../db/service/UserInfoService'
import { notificationsQueries } from './NotificationsQueries'
import neo4j from 'neo4j-driver'

class NotificationsService {

    constructor() {
    }

    /**
     * Set up relationship `notifies`
     * @param userId ID of the actor
     * @param content text content of the notification
     * @param typeOfNotification type of notification (follow, like, message etc.)
     * @returns Returns error if userId is not found. Else , {data: {numOfPath, relId } }
     */
    async notify(userId: String, content: String, typeOfNotification: String) {
        //TODO: check user's notification settings here
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
        return {
            success: true,
            message: "test",
            data: { id: "123" }
        }
    }

    /**
     * Verify if there is a `Notifies` relationship between user and notification
     * @param userId
     * @param notificationId
     * @returns true if there is, otherwise, false
     */
    async verifyRelNotifies(userId: String, notificationId: String) {
        return {
            success: true,
            message: "test",
            data: "test"
        }
    }

    /**
     * Mark a notification as read
     * @param notificationId
     * @returns true if the notification is now read, otherwise, false
     */
    async markNotificationRead(userId: String, notificationId: String) {
        return {
            success: true,
            message: "test",
            data: "test"
        }
    }

    /**
     * Get the list of notifications for a user
     * @param userId
     * @returns \{success, message, data: list of notifications}
     */
    async getNotifications(userId: String) {
        return {
            success: true,
            message: "test",
            data: {
                id: 123,
                testing: 1234
            }
        }
    }

    /**
     * Delete a notification
     * @param notificationId ID of the notification
     * @returns \{success, message, data: numbDeleted}
     */
    deteletNotificaiton(notificationId: String) {
        return {
            success: true,
            message: "test",
            data: "test"
        }
    }
}

export default NotificationsService

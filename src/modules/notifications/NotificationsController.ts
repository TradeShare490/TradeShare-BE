import { Request, Response } from 'express'
import NotificationsService from './NotificationsService'

class NotificationsController {
    private notificationsService: NotificationsService;
    constructor() {
        this.notificationsService = new NotificationsService()
    }

    async getNotifications(req: Request, res: Response) {
        const userId = req.params.userId || '-1'
        const response = await this.notificationsService.getNotifications(userId)
        return response.success ? res.send(response.data) : res.status(400).send(response)
    }

    async readNotification(req: Request, res: Response) {
        const userId = req.params.userId || '-1'
        const notificationId = req.params.notificationId || '-1'
        const response = await this.notificationsService.markNotificationRead(userId, notificationId)
        return response.success ? res.send(response.data) : res.status(400).send(response)
    }
}

export default NotificationsController

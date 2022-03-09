import { Express, Router } from 'express'
import requireUser from '../../middleware/requireUser'
import NotificationsController from './NotificationsController'

const notificationsRoute = (app: Express) => {
    const controller = new NotificationsController()
    const router = Router()

    // get notifications
    router.get('/:userId', requireUser, (req, res) => {
        controller.getNotifications(req, res)
    })

    // mark notification as read
    router.get('/readNotification/:notificationId', requireUser, (req, res) => {
        controller.readNotification(req, res)
    })

    app.use('/api/v1/notifications/', router)
}

export default notificationsRoute

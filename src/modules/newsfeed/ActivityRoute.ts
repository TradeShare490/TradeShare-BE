import { Express, Router } from 'express'
import requireUser from '../../middleware/requireUser'
import { ActivityController } from './ActivityController'

export const newsfeedRoute = (app: Express) => {
	const router = Router()

	router.get('/:userId', requireUser, ActivityController.getActivities)

	app.use('/api/v1/news/', router)
}

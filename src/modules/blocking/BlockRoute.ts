import { Express, Router } from 'express'
import requireUser from '../../middleware/requireUser'
import BlockController from './BlockController'

const blockRoute = (app: Express) => {
	const controller = new BlockController()
	const router = Router()

	// get blocked users
	router.get('/blockedUsers/:userId', requireUser, (req, res) => {
		controller.getBlockedUsers(req, res)
	})

	// block user
	router.post('/block', requireUser, (req, res) => {
		controller.blockUser(req, res)
	})

	// unblock user
	router.post('/unblock', requireUser, (req, res) => {
		controller.unblockUser(req, res)
	})

	app.use('/api/v1/managePrivacy/', router)
}

export default blockRoute

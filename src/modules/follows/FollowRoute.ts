import { Express, Router } from 'express'
import requireUser from '../../middleware/requireUser'
import FollowController from './FollowController'
import FollowRequestController from './FollowRequestController'

const followRoute = (app: Express) => {
	const controller = new FollowController()
	const router = Router()

	// get followings
	router.get('/follows/:userId', requireUser, (req, res) => {
		controller.getFollows(req, res)
	})

	// get followers
	router.get('/followers/:userId', requireUser, (req, res) => {
		controller.getFollowers(req, res)
	})

	// get request
	router.get('/requests/:userId', requireUser, FollowRequestController.verifyUserId, FollowRequestController.getPendingRequests)

	// follow another
	router.post('/follow', requireUser, (req, res) => {
		controller.follows(req, res)
	})

	// unfollow another
	router.post('/unfollow', requireUser, (req, res) => {
		controller.unfollows(req, res)
	})

	// accept request
	router.post('/requests/accept/:relId', requireUser, FollowRequestController.verifyRelId, FollowRequestController.acceptPendingRequest)

	// decline request
	router.post('/requests/decline/:relId', requireUser, FollowRequestController.verifyRelId, FollowRequestController.declinePendingRequest)

	app.use('/api/v1/following/', router)
}

export default followRoute

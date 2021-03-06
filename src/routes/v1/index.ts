import { Express } from 'express'
import userRoute from './UserRoute'
import userInfoRoute from './UserInfoRoute'
import accountRoute from './AccountRoute'
import positionsRoute from './PositionsRoute'
import activitiesRoute from './ActivitiesRoute'
import searchRoute from './SearchRoute'
import followRoute from '../../modules/follows/FollowRoute'
import conversationRoute from './ConversationRoute'
import messageRoute from './MessageRoute'
import notificationsRoute from '../../modules/notifications/NotificationsRoute'
import trendingCompaniesRoute from './TrendingCompaniesRoute'
import mailRouter from '../../utils/email/mailRouter'
import blockRoute from '../../modules/blocking/BlockRoute'

import historyRoute from './HistoryRoute'
import { newsfeedRoute } from '../../modules/newsfeed/ActivityRoute'
module.exports = function (app: Express) {
	// Register the routes
	userRoute(app)
	userInfoRoute(app)
	accountRoute(app)
	positionsRoute(app)
	activitiesRoute(app)
	searchRoute(app)
	// other routes..
	followRoute(app)
	conversationRoute(app)
	messageRoute(app)
	notificationsRoute(app)
	trendingCompaniesRoute(app)
	mailRouter(app)
	historyRoute(app)
	blockRoute(app)
	newsfeedRoute(app)
}

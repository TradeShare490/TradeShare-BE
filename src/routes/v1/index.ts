import { Express } from "express";
import defaultRoute from "./DefaultRoute";
import sessionRoute from "./SessionRoute";
import userRoute from "./UserRoute";
import userInfoRoute from "./UserInfoRoute";
import accountRoute from "./AccountRoute";
import positionsRoute from "./PositionsRoute";
import activitiesRoute from "./ActivitiesRoute";
import searchRoute from "./SearchRoute";
import followRoute from "../../modules/follows/FollowRoute";
import conversationRoute from "./ConversationRoute"
import messageRoute from "./MessageRoute"
module.exports = function (app: Express) {
	// Register the routes
	defaultRoute(app);
	userRoute(app);
	sessionRoute(app);
	userInfoRoute(app);
	accountRoute(app);
	positionsRoute(app);
	activitiesRoute(app);
	searchRoute(app);
	//other routes..
	followRoute(app);
	conversationRoute(app);
	messageRoute(app);
};

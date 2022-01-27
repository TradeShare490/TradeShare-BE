import { Express, Router } from "express";
import requireUser from "../../middleware/requireUser";
import FollowController from "./FollowController";

const followRoute = (app: Express) => {
	const controller = new FollowController();
	const router = Router();

	// get followings
	router.get("/follows/:userId", requireUser, (req, res) => {
		controller.getFollows(req, res);
	});

	// get followers
	router.get("/followers/:userId", requireUser, (req, res) => {
		controller.getFollowers(req, res);
	});

	// follow another
	router.post("/follow", requireUser, (req, res) => {
		controller.follows(req, res);
	});

	// unfollow another
	router.post("/unfollow", requireUser, (req, res) => {
		controller.unfollows(req, res);
	});

	app.use("/api/v1/following/", router);
};

export default followRoute;

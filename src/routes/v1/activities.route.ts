import express, { Express } from "express";
import ActivitiesController from "../../controllers/activities.controller";

const activitiesRoute = (app: Express) => {
	const activitiesController = new ActivitiesController();
	const router = express.Router();

	// All paths have the prefix /api/v1/session/

	router.get("/:userId", (req, res) => {
		activitiesController.getActivities(req, res);
	});

	app.use("/api/v1/activities/", router);
};

export default activitiesRoute;

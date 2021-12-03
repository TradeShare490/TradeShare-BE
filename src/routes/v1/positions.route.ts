import express, { Express } from "express";
import PositionsController from "../../controllers/positions.controller";
import requireUser from "../../middleware/requireUser";

const sessionRoute = (app: Express) => {
	const accountController = new PositionsController();
	const router = express.Router();

	// All paths have the prefix /api/v1/session/

	router.get("/:userId", (req, res) => {
		accountController.getPositions(req, res);
	});

	app.use("/api/v1/positions/", router);
};

export default sessionRoute;

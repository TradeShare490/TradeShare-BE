import express, { Express } from "express";
import SessionController from "../../controllers/session.controller";
import { createSessionSchema } from "../../db/schema/session.schema";
import validateResource from "../../middleware/validateResource";
const sessionRoute = (app: Express) => {
	const sessionController = new SessionController();
	const router = express.Router();

	// All paths have the prefix /api/v1/session/

	router.use("/", validateResource(createSessionSchema));

	router.post("/", (req, res) => {
		sessionController.createSession(req, res);
	});

	

	app.use("/api/v1/session/", router);
};

export default sessionRoute;

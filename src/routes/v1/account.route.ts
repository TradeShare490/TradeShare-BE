import express, { Express } from "express";
import AccountController from "../../controllers/account.controller";
import requireUser from "../../middleware/requireUser";

const accountRoute = (app: Express) => {
	const accountController = new AccountController();
	const router = express.Router();

	// All paths have the prefix /api/v1/session/

	router.get("/:userId", (req, res) => {
		accountController.getAccount(req, res);
	});

	app.use("/api/v1/account/", router);
};

export default accountRoute;

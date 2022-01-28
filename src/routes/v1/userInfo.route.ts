import express, { Express, Request, Response } from "express";
import UserInfoController from "../../controllers/userInfo.controller";

const userInfoRoute = (app: Express) => {
	const userInfoController = new UserInfoController();
	const router = express.Router();


    router.get("/:userId", async (req: Request, res: Response) => {
		userInfoController.getUserInfo(req,res);
	});

	router.patch("/:userId" ,(req, res) => {
		userInfoController.updateUserInfo(req, res);
	});

	router.patch("/alpaca/:userId", (req, res) => {
		userInfoController.updateAlpacaToken(req,res);
	})

	app.use("/api/v1/userInfo/", router);
};

export default userInfoRoute;

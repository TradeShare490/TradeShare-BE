import { Request, Response } from "express";
import UserInfoService from "../db/service/userInfo.service";
import UserInfoCollection from "../db/models/userInfo.model";
import mongoose from "mongoose";
import { messages } from "../db/messages";
import AlpacaService from "../db/service/alpaca.service";

class PositionsController {
	private userInfoService: UserInfoService;
	private alpacaService: AlpacaService;
	constructor() {
		this.userInfoService = new UserInfoService(UserInfoCollection);
		this.alpacaService = new AlpacaService();
	}

	async getPositions(req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId);
		const userInfo = await this.userInfoService.findUserInfo({ userId: userId });
		if (userInfo?.alpacaToken) {
			return this.alpacaService.getInfo(req, res, "/positions", "positions", userInfo.alpacaToken);
		} else {
			res.send(messages.internalError("User hasn't linked any Alpaca account"));
		}
	}
}

export default PositionsController;

import { Request, Response } from "express";
import UserInfoService from "../db/service/userInfo.service";
import UserInfoCollection from "../db/models/userInfo.model";
import mongoose from "mongoose";
import { messages } from "../db/messages";
import AlpacaService from "../db/service/alpaca.service";

class AccountController {
	private userInfoService: UserInfoService;
	private alpacaService: AlpacaService;
	constructor() {
		this.userInfoService = new UserInfoService(UserInfoCollection);
		this.alpacaService = new AlpacaService();
	}

	async getAccount(req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId);
		const userInfo = await this.userInfoService.findUserInfo({ userId: userId });
		if (userInfo?.alpacaToken) {
			return await this.alpacaService.getInfo(req, res, "/account", "account", userInfo.alpacaToken);
		} else {
			return res.send(messages.internalError("User hasn't linked any Alpaca account"));
		}
	}
}

export default AccountController;

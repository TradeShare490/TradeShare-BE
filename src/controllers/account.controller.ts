import { Request, Response } from "express";
import UserInfoService from "../db/service/userInfo.service";
import UserInfoCollection from "../db/models/userInfo.model";
import mongoose from "mongoose";
import axios from "axios";
class AccountController {
	private userInfoService: UserInfoService;
	constructor() {
		this.userInfoService = new UserInfoService(UserInfoCollection);
	}

	async getAccount(req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId);
		const userInfo = await this.userInfoService.findUserInfo({ userId: userId });
		let account = {};
		if (userInfo?.alpacaToken) {
			const alpacaToken = userInfo.alpacaToken;
			const response = await axios.get("https://paper-api.alpaca.markets/v2/account", {
				headers: { Authorization: `Bearer ` + alpacaToken },
			});
			account = response.data;
		}
		res.send(account);
	}
}

export default AccountController;

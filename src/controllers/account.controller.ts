import { Request, Response } from "express";
import UserInfoService from "../db/service/userInfo.service";
import UserInfoCollection from "../db/models/userInfo.model";
import mongoose from "mongoose";
import axios from "../utils/axios/axios.v1";
import { messages } from "../db/messages";

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
			try{
			const alpacaToken = userInfo.alpacaToken;
			const response = await axios.get("/account", {
				headers: { Authorization: `Bearer ` + alpacaToken },
			});
			account = response.data;
			return res.send(messages.successMessage("success", "account", account))
		}
		catch (error: any) {
			 res.send(messages.internalError(error.response.data.message));
		}
		}
		res.send(messages.internalError("User hasn't linked any Alpaca account"));
	}
}

export default AccountController;

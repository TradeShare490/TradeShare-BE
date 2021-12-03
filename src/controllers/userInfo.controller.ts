import { Request, Response } from "express";
import UserInfoCollection from "../db/models/userInfo.model";
import UserInfoService from "../db/service/userInfo.service";
import mongoose from "mongoose";

class UserInfoController {
	private userInfoService: UserInfoService;

	constructor() {
		this.userInfoService = new UserInfoService(UserInfoCollection);
	}

	async getUserInfo(req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId);

		return res.send(await this.userInfoService.findUserInfo({ userId: userId }));
	}

	async updateUserInfo(req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId);
		const updatedInfo = await this.userInfoService.updateUserInfo({ userId: userId }, req.body, {
			new: true,
		});
		return res.send(updatedInfo);
	}
}

export default UserInfoController;

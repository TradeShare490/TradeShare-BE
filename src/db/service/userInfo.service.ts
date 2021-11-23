import mongoose, { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { messages, MessageResponse } from "../messages";
import { UserInfo } from "../models/userInfo.model";

export default class UserInfoService {
	private userInfoCollection: Model<UserInfo>;

	constructor(userInfoCollection: Model<UserInfo>) {
		this.userInfoCollection = userInfoCollection;
	}

	async findUserInfo(query: FilterQuery<UserInfo>) {
		const userInfo = this.userInfoCollection.findOne(query);
		return userInfo;
	}

	async createUserInfo(id: mongoose.Schema.Types.ObjectId, body: any): Promise<MessageResponse> {
		try {
			const input = {
				firstname: body.firstname,
				lastname: body.lastname,
				userId: id,
				username: body.username,
				email: body.email,
			};
			const userInfo = await this.userInfoCollection.create(input);
			return messages.createdMessage("UserInfo has beeen created", "user", userInfo.toJSON());
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}

	async updateUserInfo(
		query: FilterQuery<UserInfo>,
		update: UpdateQuery<UserInfo>,
		options: QueryOptions
	) {
		return await this.userInfoCollection.findOneAndUpdate(query, update, options);
	}
}

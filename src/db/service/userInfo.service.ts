import mongoose, { FilterQuery, Model, QueryOptions, UpdateQuery } from "mongoose";
import { messages, MessageResponse } from "../messages";
import { UserInfo } from "../models/userInfo.model";

export default class UserInfoService {
	private userInfoCollection: Model<UserInfo>;

	constructor(userInfoCollection: Model<UserInfo>) {
		this.userInfoCollection = userInfoCollection;
	}

	async findUserInfo(query: FilterQuery<UserInfo>) {
		try {
			const userInfo = this.userInfoCollection.findOne(query);
			return userInfo;
		} catch (error: any) {
			return messages.internalError(error.message);
		}
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
		try {
			return await this.userInfoCollection.findOneAndUpdate(query, update, options);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}
	
	async deleteUser(id: string): Promise<MessageResponse> {
		try {
			const response = await this.userInfoCollection.deleteOne({ userId: id });
			return messages.successMessage(
				`${response.deletedCount} userinfo has been deleted`,
				"deletedCount",
				response.deletedCount
			);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}
}

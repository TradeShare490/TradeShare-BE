import UserService, { UserFindParameters } from "../db/service/user.service";
import { Request, Response } from "express";
import { MessageResponse, messages } from "../db/messages";
import UserCollection from "../db/models/user.model";
import UserInfoCollection from "../db/models/userInfo.model";
import { CreateUserInput } from "../db/schema/user.schema";
import UserInfoService from "../db/service/userInfo.service";

class UserController {
	private userService: UserService;
	private userInfoService: UserInfoService;
	constructor() {
		this.userService = new UserService(UserCollection);
		this.userInfoService = new UserInfoService(UserInfoCollection);
	}

	/**
	 * Create a new user in MongoDB
	 * @param input the data for creating new user, please consult the UserSchema as a reference
	 * @returns a new User object with _id
	 */
	async createUser(req: Request<{}, {}, CreateUserInput["body"]>, res: Response) {
		let user = await this.userService.createUser(req.body);
		if (user.success) {
			let info = await this.userInfoService.createUserInfo(user.user._id, req.body);
			if (info.success) {
				res.send(user);
			} else {
				const payload = info;
				res.status(payload.status).send(payload);
			}
		} else {
			const payload = user;
			res.status(payload.status).send(payload);
		}
	}

	/**
	 * Delete a user by id
	 * @param id User id to be deleted
	 * @returns
	 */
	deleteUser(id: UserFindParameters["id"]): Promise<MessageResponse> {
		return this.userService.deleteUser(id);
	}

	/**
	 * Get a user by id or username
	 * @param originalParam User id or username
	 * @returns response with the user found
	 */
	getUser(originalParam: UserFindParameters): Promise<MessageResponse> {
		return this.userService.getUser(originalParam);
	}

	/**
	 * Update a user by user id
	 * @param id user id
	 * @param input content for update
	 * @returns response with new User object
	 */
	updateUser(id: UserFindParameters["id"], input: any): Promise<MessageResponse> {
		return this.userService.updateUser(id, input);
	}
}

export default UserController;

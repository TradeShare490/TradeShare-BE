import UserService, { UserFindParameters } from "../db/service/user.service";
import { Request, Response } from "express";
import { MessageResponse } from "../db/messages";
import UserCollection from "../db/models/user.model";
import UserInfoCollection from "../db/models/userInfo.model";
import { CreateUserInput } from "../db/schema/user.schema";

class UserController {
	private userService: UserService;

	constructor() {
		this.userService = new UserService(UserCollection, UserInfoCollection);
	}

	/**
	 * Create a new user in MongoDB
	 * @param input the data for creating new user, please consult the UserSchema as a reference
	 * @returns a new User object with _id
	 */
	async createUser(req: Request<{}, {}, CreateUserInput["body"]>,
	res: Response) {
		try{
		console.log("test user service");
		console.log(this.userService);	
		const user = await this.userService.createUser(req.body);
		return res.send(user);
		} catch (e:any){
			return res.status(409).send(e.message)
		}
	}

	/**
	 * Delete a user by id
	 * @param id User id to be deleted
	 * @returns
	 */
	async deleteUser(id: UserFindParameters["id"]): Promise<MessageResponse> {
		return await this.userService.deleteUser(id);
	}

	/**
	 * Get a user by id or username
	 * @param originalParam User id or username
	 * @returns response with the user found
	 */
	async getUser(originalParam: UserFindParameters): Promise<MessageResponse> {
		return await this.userService.getUser(originalParam);
	}

	/**
	 * Update a user by user id
	 * @param id user id
	 * @param input content for update
	 * @returns response with new User object
	 */
	async updateUser(id: UserFindParameters["id"], input: any): Promise<MessageResponse> {
		return await this.userService.updateUser(id, input);
	}
}

export default UserController;

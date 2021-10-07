import UserController, { UserFindParameters } from "../db/controllers/user.controller";
import { MessageResponse } from "../db/messages";
import LoginUserCollection from "../db/models/loginUser.model";
import UserInfoCollection from "../db/models/userInfo.model";

class UserService {
	private userController: UserController;

	constructor() {
		this.userController = new UserController(LoginUserCollection, UserInfoCollection);
	}

	/**
	 * Create a new user in MongoDB
	 * @param input the data for creating new user, please consult the UserSchema as a reference
	 * @returns a new User object with _id
	 */
	async createUser(input: any): Promise<MessageResponse> {
		return await this.userController.createUser(input);
	}

	/**
	 * Delete a user by id
	 * @param id User id to be deleted
	 * @returns
	 */
	async deleteUser(id: UserFindParameters["id"]): Promise<MessageResponse> {
		return await this.userController.deleteUser(id);
	}

	/**
	 * Get a user by id or username
	 * @param originalParam User id or username
	 * @returns response with the user found
	 */
	async getUser(originalParam: UserFindParameters): Promise<MessageResponse> {
		return await this.userController.getUser(originalParam);
	}

	/**
	 * Update a user by user id
	 * @param id user id
	 * @param input content for update
	 * @returns response with new User object
	 */
	async updateUser(id: UserFindParameters["id"], input: any): Promise<MessageResponse> {
		return await this.userController.updateUser(id, input);
	}
}

export default UserService;

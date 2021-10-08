import { Model, DocumentDefinition } from "mongoose";
import { messages, MessageResponse } from "../messages";
import { GLOBAL_QUERY_LIMIT, ParsedParameters } from "../helpers";
import UserModel, { UserDocument } from "../models/user.model";
import { omit } from "lodash";
import { UserInfo } from "../models/userInfo.model";
export interface UserFindParameters {
	email?: string;
	searchQuery?: any;
	id?: string;
	limit?: number;
	skip?: number;
}

export default class UserService {
	private UserDocumentCollection: Model<UserDocument>; // a reference from the collection inside the database
	private userInfoCollection: Model<UserInfo>;
	constructor(UserDocumentCollection: Model<UserDocument>, userInfoCollection: Model<UserInfo>) {
		this.UserDocumentCollection = UserDocumentCollection;
		this.userInfoCollection = userInfoCollection;
	}

	/**
	 * Convert the params into MongoDB filter query
	 * @param originalParams Parameters passed from users
	 * @returns MongoDB search filter
	 */
	parseParams(originalParams: UserFindParameters): ParsedParameters {
		var params = { ...originalParams }; // make a deep copy, so we don't change the original if there is error

		// if searching for specific item by id
		if (params.id !== undefined) {
			return {
				find: { _id: params.id },
				limit: 1,
				skip: 0,
			};
		} else if (params.email !== undefined) {
			return {
				find: { email: params.email },
				limit: 1,
				skip: 0,
			};
		}

		// searching for a range of result
		var searchParams = {};
		if (params.searchQuery) {
			searchParams = {
				...searchParams,
				$or: [{ username: { $regex: params.searchQuery, $option: "i" } }],
			};
		}

		// Default limit and skip - in case require pagination
		const limit = params.limit || GLOBAL_QUERY_LIMIT;
		const skip = params.skip || 0;

		// if ommited, will try to match on field which doesn't exist
		delete params.limit;
		delete params.skip;
		delete params.searchQuery;

		searchParams = { ...searchParams, ...params }; // ...params in case something remains

		// Finally, return mongoDB search query (or so-called filter)
		return {
			find: searchParams,
			limit: limit,
			skip: skip,
		};
	}
	/**
	 * Create a new user in MongoDB
	 * @param input the data for creating new user, please consult the UserSchema as a reference
	 * @returns a new User object with _id
	 */
	async createUser(
		input: DocumentDefinition<Omit<UserDocument, "createdAt" | "updatedAt" | "comparePassword">>
	): Promise<MessageResponse> {
		try {
			const user = await UserModel.create(input);
			return messages.createdMessage(
				"User has beeen created",
				"user",
				omit(user.toJSON(), "password")
			);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}

	/**
	 * Delete a user by id
	 * @param id User id to be deleted
	 * @returns
	 */
	async deleteUser(id: UserFindParameters["id"]): Promise<MessageResponse> {
		try {
			const response = await this.UserDocumentCollection.deleteOne({ _id: id });
			return messages.successMessage(
				`${response.deletedCount} user has been deleted`,
				"deletedCount",
				response.deletedCount
			);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}

	/**
	 * Get a user by id or username
	 * @param originalParam User id or username
	 * @returns response with the user found
	 */
	async getUser(originalParam: UserFindParameters): Promise<MessageResponse> {
		try {
			const parsedParam = this.parseParams(originalParam);
			const response = await this.UserDocumentCollection.find(parsedParam.find)
				.skip(parsedParam.skip)
				.limit(parsedParam.limit);
			return response.length > 0
				? messages.successMessage("The user has been found", "user", response[0])
				: messages.successMessage("No match found", "user", []);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}

	/**
	 * Update a user by user id
	 * @param id user id
	 * @param input content for update
	 * @returns response with new User object
	 */
	async updateUser(id: UserFindParameters["id"], input: any): Promise<MessageResponse> {
		try {
			const updateResponse = await this.UserDocumentCollection.findByIdAndUpdate(id, input, {
				new: true,
				setDefaultsOnInsert: true,
			});
			return messages.successMessage("Successfully updated the user", "user", updateResponse);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}
}

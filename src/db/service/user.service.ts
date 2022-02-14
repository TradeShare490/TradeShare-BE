import { Model, DocumentDefinition, FilterQuery, UpdateQuery, QueryOptions } from "mongoose";
import { messages, MessageResponse } from "../messages";
import { GLOBAL_QUERY_LIMIT, ParsedParameters } from "../helpers";
import { UserDocument } from "../models/user.model";
import { omit } from "lodash";
export interface UserFindParameters {
	email?: string;
	username?: string;
	searchQuery?: any;
	id?: string;
	limit?: number;
	skip?: number;
}

export default class UserService {
	private userDocumentCollection: Model<UserDocument>; // a reference from the collection inside the database
	constructor(userDocumentCollection: Model<UserDocument>) {
		this.userDocumentCollection = userDocumentCollection;
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
		} else if (params.username !== undefined) {
			return {
				find: { username: params.username },
				limit: 1,
				skip: 0,
			};
		}

		// searching for a range of result, empty means taking any available items
		var searchParams = {};

		// Default limit and skip - in case require pagination
		const limit = params.limit || GLOBAL_QUERY_LIMIT;
		const skip = params.skip || 0;

		// if ommited, will try to match on field which doesn't exist
		delete params.limit;
		delete params.skip;

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
			const user = await this.userDocumentCollection.create(input);
			return messages.createdMessage(
				"User has beeen created",
				"user",
				omit(user.toJSON(), "password")
			);
		} catch (error: any) {
			if (error.message.includes("username")) {
				return messages.internalError("Username already exists");
			} 
			else if(error.message.includes("email")) {
				return messages.internalError("Email already exists");
			}
			else {
				return messages.internalError(error.message);
			}
		}
	}

	/**
	 * Delete a user by id
	 * @param id User id to be deleted
	 * @returns
	 */
	async deleteUser(id: UserFindParameters["id"]): Promise<MessageResponse> {
		try {
			const response = await this.userDocumentCollection.deleteOne({ _id: id });
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
		const validInput =
			originalParam.email !== undefined ||
			originalParam.username !== undefined ||
			originalParam.id !== undefined;
		if (!validInput) {
			return messages.badInput("Missing email or username");
		}

		try {
			const parsedParam = this.parseParams(originalParam);
			const response = await this.userDocumentCollection
				.find(parsedParam.find)
				.skip(parsedParam.skip)
				.limit(parsedParam.limit);
			return response.length > 0
				? messages.successMessage("The user has been found", "user", response[0])
				: messages.successMessage("No match found", "user", []);
		} catch (error: any) {
			/* istanbul ignore next */
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
			const updateResponse = await this.userDocumentCollection.findByIdAndUpdate(id, input, {
				new: true,
				setDefaultsOnInsert: true,
			});
			return messages.successMessage("Successfully updated the user", "user", updateResponse);
		} catch (error: any) {
			return messages.internalError(error.message);
		}
	}

	async validatePassword(body: any) {
		const result = await this.getUser(body);
		const notFound = !result.success || result.user.length == 0;
		if (notFound) {
			return false;
		}

		const isValid = await result.user.comparePassword(body.password);

		if (!isValid) return false;

		return omit(result.user.toJSON(), "password");
	}

	async findUser(query: FilterQuery<UserDocument>) {
		return this.userDocumentCollection.findOne(query).lean();
	}
}

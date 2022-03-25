import mongoose, { FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose'
import { GLOBAL_QUERY_LIMIT, ParsedParameters } from '../helpers'
import { messages, MessageResponse } from '../messages'
import { UserInfo } from '../models/userInfo.model'

export interface UserInfoSearchInput {
	email?: string;
	username?: string;
	searchQuery?: any;
	limit?: number;
	skip?: number;
	userId?: number | mongoose.Types.ObjectId;
}

export default class UserInfoService {
	private userInfoCollection: Model<UserInfo>;

	constructor (userInfoCollection: Model<UserInfo>) {
		this.userInfoCollection = userInfoCollection
	}

	/**
	 * Convert the params into MongoDB filter query
	 * @param originalParams Parameters passed from users
	 * @returns MongoDB search filter
	 */
	parseParams (originalParams: UserInfoSearchInput): ParsedParameters {
		const params = { ...originalParams } // make a deep copy, so we don't change the original if there is error
		// if searching for specific item by id
		if (params.userId !== undefined) {
			return {
				find: { userId: new mongoose.Types.ObjectId(params.userId) },
				limit: 1,
				skip: 0
			}
		} else if (params.email !== undefined) {
			return {
				find: { email: params.email },
				limit: 1,
				skip: 0
			}
		}

		// searching for a range of result, empty means taking any available items
		let searchParams = {}

		if (params.searchQuery) {
			searchParams = {
				$or: [{ username: { $regex: params.searchQuery, $options: 'i' } },
					{ email: { $regex: params.searchQuery, $options: 'i' } },
					{ firstname: { $regex: params.searchQuery, $options: 'i' } },
					{ lastname: { $regex: params.searchQuery, $options: 'i' } }]
			}
		}

		// Default limit and skip - in case require pagination
		const limit = params.limit || GLOBAL_QUERY_LIMIT
		const skip = params.skip || 0

		// if ommited, will try to match on field which doesn't exist
		delete params.limit
		delete params.skip

		searchParams = { ...searchParams, ...params } // ...params in case something remains

		// Finally, return mongoDB search query (or so-called filter)
		return {
			find: searchParams,
			limit: limit,
			skip: skip
		}
	}

	async findUserInfo (query: FilterQuery<UserInfo>) {
		try {
			return this.userInfoCollection.findOne(query)
		} catch (error: any) {
			/* istanbul ignore next  */
			return messages.internalError(error.message)
		}
	}

	async getUserInfos (oriParams: UserInfoSearchInput) {
		try {
			// convert to integer
			if (oriParams?.skip) {
				oriParams.skip = Number.parseInt('' + oriParams.skip)
			}
			if (oriParams?.limit) {
				oriParams.limit = Number.parseInt('' + oriParams.limit)
			}

			// parsing params
			const parsedParam = this.parseParams(oriParams)
			const response = await this.userInfoCollection
				.find(parsedParam.find)
				.skip(parsedParam.skip)
				.limit(parsedParam.limit)
			return { success: true, data: response }
		} catch (error: any) {
			/* istanbul ignore next  */
			return messages.internalError(error.message)
		}
	}

	async createUserInfo (id: mongoose.Schema.Types.ObjectId, body: any): Promise<MessageResponse> {
		try {
			const input = {
				firstname: body.firstname,
				lastname: body.lastname,
				userId: id,
				username: body.username,
				email: body.email
			}
			const userInfo = await this.userInfoCollection.create(input)
			return messages.createdMessage('UserInfo has beeen created', 'user', userInfo.toJSON())
		} catch (error: any) {
			/* istanbul ignore next  */
			return messages.internalError(error.message)
		}
	}

	async updateUserInfo (
		query: FilterQuery<UserInfo>,
		update: UpdateQuery<UserInfo>,
		options: QueryOptions
	) {
		try {
			return await this.userInfoCollection.findOneAndUpdate(query, update, options)
		} catch (error: any) {
			/* istanbul ignore next */
			return messages.internalError(error.message)
		}
	}

	async deleteUser (id: string): Promise<MessageResponse> {
		try {
			const response = await this.userInfoCollection.deleteOne({ userId: id })
			return messages.successMessage(
				`${response.deletedCount} userinfo has been deleted`,
				'deletedCount',
				response.deletedCount
			)
		} catch (error: any) {
			/* istanbul ignore next */
			return messages.internalError(error.message)
		}
	}
}

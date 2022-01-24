import { UserInfo } from "../../db/models/userInfo.model";
import neo4jInstance, { QueryMode } from "../../db/neo4j/Neo4jInstance";
import UserInfoService from "../../db/service/userInfo.service";
import { followQueries } from "./FollowQueries";
import UserInfoCollection from "../../db/models/userInfo.model";
import mongoose from "mongoose";
import neo4j from "neo4j-driver";

class FollowService {
	private userInfoService: UserInfoService;
	constructor() {
		this.userInfoService = new UserInfoService(UserInfoCollection);
	}

	/**
	 * Set up relationship `Follows`
	 * @param srcUserId ID of the actor
	 * @param targetUserId ID of the target
	 * @returns Returns error if `Follows` already exists
	 */
	async follow(srcUserId: UserInfo["userId"], targetUserId: UserInfo["userId"]) {
		// Check if the relationship already exist or not
		const relExists = await this.verifyRelFollows(srcUserId, targetUserId);
		// If exists, return error and message: "Already exists"
		if (relExists) {
			return { success: false, message: "The actor already followed this user" };
		}

		// If does not exist, setup follow relationship between the two users
		// Get the profile visibility of the target user
		const targetUserMongoId = new mongoose.Types.ObjectId(targetUserId); // convert into MongoDB ID Object
		const targerUserInfo = await this.userInfoService.findUserInfo({
			userId: targetUserMongoId,
		});
		if (targerUserInfo?.isPrivate) {
			// TODO: If private profile, continue here
			// Requires: notification mechanism and set `Follows` relationship to `isPending`
			return { success: false, message: "This function is not ready, work is in progress" };
		} else {
			return await this.createRelFollows(srcUserId, targetUserId);
		}
	}

	/**
	 * Create a `Follows` relationship
	 * @param srcUserId
	 * @param targetUserId
	 * @param isPending whether this relationship requires approval, false by default
	 * @returns
	 */
	async createRelFollows(
		srcUserId: UserInfo["userId"],
		targetUserId: UserInfo["userId"],
		isPending = false
	) {
		const query = followQueries.CREATE_RELATIONSHIP;
		const params = {
			src: srcUserId,
			target: targetUserId,
			isPending: isPending,
		};

		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.write);
		if (queryResponse.success && queryResponse.data[0]) {
			// field_name based on the RETURN in the query
			const numOfPath = neo4j.integer.toNumber(queryResponse.data[0].get("numOfPath"));
			const relId = neo4j.integer.toNumber(queryResponse.data[0].get("relId"));
			return {
				success: true,
				message: queryResponse.message,
				data: { numOfPath: numOfPath, relId: relId },
			};
		} else {
			return queryResponse;
		}
	}

	/**
	 * Verify if there is a `Follows` relationship between src and target user
	 * @param srcUserId
	 * @param targetUserId
	 * @returns true if there is, otherwise, false
	 */
	async verifyRelFollows(srcUserId: UserInfo["userId"], targetUserId: UserInfo["userId"]) {
		const query = followQueries.GET_RELATIONSHION_BETWEEN_USERS;
		const params = {
			src: srcUserId,
			target: targetUserId,
		};
		const { success, data } = await neo4jInstance.runQueryInTransaction(
			query,
			params,
			QueryMode.read
		);

		const relExists = success && data != undefined && data[0].get("relExists") == true;
		return relExists;
	}

	/**
	 * Get the list of account_ids the user follows
	 * @param userId
	 * @returns
	 */
	async getFollows(userId: UserInfo["userId"]) {
		const query = followQueries.GET_FOLLOWS_FOR_USER;
		const params = {
			userId: userId,
		};
		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read);
		if (queryResponse.success && queryResponse.data.length > 0) {
			// update the return data
			const listOfUserIds = [];
			// will receive an array of IDs which the user follows
			for (const record of queryResponse.data) {
				listOfUserIds.push(record.get("followId"));
			}

			return {
				success: true,
				message: queryResponse.message,
				data: listOfUserIds,
			};
		} else {
			return queryResponse;
		}
	}

	/**
	 * Get the list of account_ids who follow this user
	 * @param userId
	 * @returns
	 */
	async getFollowers(userId: UserInfo["userId"]) {
		const query = followQueries.GET_FOLLOWERS_FOR_USER;
		const params = {
			userId: userId,
		};
		const queryResponse = await neo4jInstance.runQueryInTransaction(query, params, QueryMode.read);
		if (queryResponse.success && queryResponse.data.length > 0) {
			// update the return data
			const listOfUserIds = [];
			// will receive an array of IDs which follows the user
			for (const record of queryResponse.data) {
				listOfUserIds.push(record.get("followerId"));
			}

			return {
				success: true,
				message: queryResponse.message,
				data: listOfUserIds,
			};
		} else {
			return queryResponse;
		}
	}
}

export default FollowService;

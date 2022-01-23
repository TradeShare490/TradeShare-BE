import { expect } from "chai";
import FollowService from "../modules/follows/FollowService";
import { cleanupMockedUserInfo, createAndTestUserInfo } from "./2_userInfo.test";

describe("Follow service can", () => {
	let followService: FollowService;
	let mockedFollower;
	let mockedUser;

	describe("setup", () => {
		it("instantiate the service class", () => {
			followService = new FollowService();
			expect(followService).not.equal(undefined);
		});

		it("create prerequesite data", () => {
			// instantiate userService
			// createAndTestUserInfo()
			// need two tests users
		});
	});

	describe("follow users", () => {
		it("follow another user", () => {
			// mockedFollower sends request to mockedUser
		});

		it.skip("recevie notification if the profile is private", () => {
			// mockedUser gets notification if profile is private; public by default
			// only do public requests for now
		});

		it.skip("follow request is pending if the profile is private", () => {
			// the service searches for the relationship, the relationship should have status as "pending"
			// look for status as 1 direction
			// only do public requests for now
		});
	});

	describe("get list of follows/followers for a user by userId", () => {
		it("get list of followers", () => {
			// mockedUser get list of followers
		});
		it("get list of followings", () => {
			// mockedFollower get list of followings
		});
	});

	describe("unfollow users", () => {
		it("unfollow another user", () => {
			// mockedFollower unfollow mockedUser, check list of followings
		});
	});

	describe("clean up test suite", () => {
		// delete the mocked users
		// cleanupMockedUserInfo()
	});
});

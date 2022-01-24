import { expect } from "chai";
import UserService from "../db/service/user.service";
import UserInfoService from "../db/service/userInfo.service";
import FollowService from "../modules/follows/FollowService";
import UserCollection, { UserDocument } from "../db/models/user.model";
import UserInfoCollection, { UserInfo } from "../db/models/userInfo.model";

import { cleanupMockedUserInfo, createAndTestUserInfo } from "./2_userInfo.test";

interface MockedUser {
	mockedUser: UserDocument;
	mockedInfo: UserInfo;
}

describe.only("Follow service can", () => {
	let followService: FollowService;
	let mockedFollower: MockedUser;
	let mockedUser: MockedUser;
	let userService: UserService;
	let userInfoService: UserInfoService;

	describe("setup", () => {
		it("instantiate the service class", () => {
			followService = new FollowService();
			expect(followService).not.equal(undefined);
		});

		it("create prerequesite services", () => {
			userService = new UserService(UserCollection);
			userInfoService = new UserInfoService(UserInfoCollection);
			expect(userService).not.equal(undefined);
			expect(userInfoService).not.equal(undefined);
		});

		it("create two mocked users", async () => {
			const mockedUserInput = {
				createUserInput: {
					email: "mocked@email.com",
					password: "ken123456",
					username: "mockedUser",
				},
				createInfoInput: {
					firstname: "Mocked",
					lastname: "User",
					email: "mocked@email.com",
					username: "kentest4",
				},
			};

			const mockedFollowerInput = {
				createUserInput: {
					email: "mockedFollower@email.com",
					password: "ken123456",
					username: "mockedFollower",
				},
				createInfoInput: {
					firstname: "Mocked",
					lastname: "Follower",
					email: "mockedFollower@email.com",
					username: "kentest4",
				},
			};

			mockedFollower = await createAndTestUserInfo({
				createUserInfoInput: mockedFollowerInput.createInfoInput,
				createUserInput: mockedFollowerInput.createUserInput,
				userInfoService: userInfoService,
				userService: userService,
			});

			mockedUser = await createAndTestUserInfo({
				createUserInfoInput: mockedUserInput.createInfoInput,
				createUserInput: mockedUserInput.createUserInput,
				userInfoService: userInfoService,
				userService: userService,
			});
		});
	});

	describe("follow users", () => {
		it("follow another user", async () => {
			// mockedFollower sends request to mockedUser
			const result = await followService.follow(
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			);
			console.log(result);
			expect(result.success).to.be.true;
		});

		it("prevent duplicate request", async () => {
			// mockedFollower sends request to mockedUser
			const result = await followService.follow(
				mockedFollower.mockedInfo.userId.toJSON(),
				mockedUser.mockedInfo.userId.toJSON()
			);
			console.log(result);
			expect(result.success).to.be.false;
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

	describe.skip("get list of follows/followers for a user by userId", () => {
		it("get list of followers", () => {
			// mockedUser get list of followers
		});
		it("get list of followings", () => {
			// mockedFollower get list of followings
		});
	});

	describe.skip("unfollow users", () => {
		it("unfollow another user", () => {
			// mockedFollower unfollow mockedUser, check list of followings
		});
	});

	describe("clean up the test suite", () => {
		it("delete all mocked users", async () => {
			// delete the mocked users
			await cleanupMockedUserInfo({
				mockedUserId: mockedUser.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService,
			});

			await cleanupMockedUserInfo({
				mockedUserId: mockedFollower.mockedInfo.userId,
				userInfoService: userInfoService,
				userService: userService,
			});
		});
	});
});

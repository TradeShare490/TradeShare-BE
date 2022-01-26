import { expect } from "chai";
import { UserDocument } from "../db/models/user.model";
import { UserInfo } from "../db/models/userInfo.model";
import UserService from "../db/service/user.service";
import UserCollection from "../db/models/user.model";
import UserInfoService from "../db/service/userInfo.service";
import UserInfoCollection from "../db/models/userInfo.model";

describe("User Info Service can", () => {
	let mockedUser: UserDocument;
	let mockedInfo: UserInfo;
	let userService: UserService;
	let userInfoService: UserInfoService;

	it("be setup", () => {
		userService = new UserService(UserCollection);
		userInfoService = new UserInfoService(UserInfoCollection);
		expect(userService).not.equal(undefined);
		expect(userInfoService).not.equal(undefined);
	});

	it("create a new userInfo", async () => {
		const createInput = {
			email: "ken@email.com",
			password: "ken123456",
			username: "kentest4",
		};

		const infoInput = {
			firstname: "Ken",
			lastname: "Nguyen",
			email: "ken@email.com",
			username: "kentest4",
		};

		const response = await createAndTestUserInfo({
			createUserInfoInput: infoInput,
			createUserInput: createInput,
			userInfoService: userInfoService,
			userService: userService,
		});

		mockedUser = response.mockedUser;
		mockedInfo = response.mockedInfo;
	});

	it("get user info by userId", async () => {
		const res = await userInfoService.findUserInfo({ userId: mockedUser._id });
		expect(res?.email).to.equal(mockedInfo.email);
		expect(res?.firstname).to.equal(mockedInfo.firstname);
		expect(res?.lastname).to.equal(mockedInfo.lastname);
		expect(res?.userId.toHexString()).to.equal(mockedUser._id.toHexString());
	});

	it("get user info by username", async () => {
		const res = await userInfoService.findUserInfo({ username: mockedUser.username });
		expect(res?.email).to.equal(mockedInfo.email);
		expect(res?.firstname).to.equal(mockedInfo.firstname);
		expect(res?.lastname).to.equal(mockedInfo.lastname);
		expect(res?.userId.toHexString()).to.equal(mockedUser._id.toHexString());
	});

	it("update user info", async () => {
		const updateInput = {
			alpacaToken: "ofjweofjwoeifj",
			isPrivate: true,
		};
		const res = await userInfoService.updateUserInfo({ userId: mockedUser._id }, updateInput, {
			new: true,
		});
		expect(res?.isPrivate).not.equal(mockedInfo.isPrivate);
		expect(res?.alpacaToken).to.equal("ofjweofjwoeifj");
	});

	it("Clean up", async () => {
		await cleanupMockedUserInfo({
			mockedUserId: mockedUser._id,
			userInfoService: userInfoService,
			userService: userService,
		});
	});
});

// reusable functions/methods
interface CreateUserInput {
	email: string;
	password: string;
	username: string;
}

interface CreateUserInfoInput {
	firstname: string;
	lastname: string;
	email: string;
	username: string;
}

export interface CreateAndTestUserInfoInput {
	userService: UserService;
	userInfoService: UserInfoService;
	createUserInput: CreateUserInput;
	createUserInfoInput: CreateUserInfoInput;
}

export interface CleanupMockedUserInfoInput {
	userService: UserService;
	userInfoService: UserInfoService;
	mockedUserId: UserDocument["id"];
}

/**
 * Create a userDocument and a userInfo for testing purpose
 * @param input
 * @returns An object {mockedUser, mockedInfo}
 */
export const createAndTestUserInfo = async (input: CreateAndTestUserInfoInput) => {
	let createUserDocumentResponse = await input.userService.createUser(input.createUserInput);
	expect(createUserDocumentResponse.success).to.be.true;
	expect(createUserDocumentResponse.user).not.equal(undefined);

	const mockedUserDocument: UserDocument = createUserDocumentResponse.user;

	let infoResponse = await input.userInfoService.createUserInfo(
		mockedUserDocument._id,
		input.createUserInfoInput
	);

	expect(infoResponse.user).to.have.property("_id");
	expect(infoResponse.user).to.have.property("email");
	expect(infoResponse.user).to.have.property("firstname");
	expect(infoResponse.user).to.have.property("lastname");
	return { mockedUser: mockedUserDocument, mockedInfo: infoResponse.user };
};

/**
 * Delete the userDocument and userInfo based on the userID
 * @param input
 */
export const cleanupMockedUserInfo = async (input: CleanupMockedUserInfoInput) => {
	const { success: deleteUserDocSuccess } = await input.userService.deleteUser(input.mockedUserId);
	const { success: deleteUserInfoSuccess } = await input.userInfoService.deleteUser(
		input.mockedUserId
	);
	expect(deleteUserDocSuccess).to.be.true;
	expect(deleteUserInfoSuccess).to.be.true;
};

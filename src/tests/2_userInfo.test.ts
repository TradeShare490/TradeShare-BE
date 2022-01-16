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
		const input = {
			email: "ken@email.com",
			password: "ken123456",
			username: "kentest"
		};
		let response: any;
		try {
			response = await userService.createUser(input);
		} catch (error) {
			console.error(error);
		}
		mockedUser = response.user;
		const infoInput = {
			firstname: "Ken",
			lastname: "Nguyen",
			email: "ken@email.com",
		};
		let infoResponse: any;
		try {
			infoResponse = await userInfoService.createUserInfo(mockedUser._id, infoInput);
		} catch (error) {
			console.error(error);
		}
		expect(infoResponse.user).to.have.property("_id");
		expect(infoResponse.user).to.have.property("email");
		expect(infoResponse.user).to.have.property("firstname");
		expect(infoResponse.user).to.have.property("lastname");
		mockedInfo = infoResponse.user;
	});
	it("get user info", async () => {
		const res = await userInfoService.findUserInfo({ userId: mockedUser._id });
		expect(res?.email).to.equal(mockedInfo.email);
		expect(res?.firstname).to.equal(mockedInfo.firstname);
		expect(res?.lastname).to.equal(mockedInfo.lastname);
		expect(res?.userId.toHexString()).to.equal(mockedUser._id.toHexString());
	});
	it("update user info", async () => {
		const updateInput = {
			alpacaToken: "ofjweofjwoeifj",
		};
		const res = await userInfoService.updateUserInfo({ userId: mockedUser._id }, updateInput, {
			new: true,
		});
		expect(res?.alpacaToken).to.equal("ofjweofjwoeifj");
	});
	it("Clean up", async () => {
		userService.deleteUser(mockedUser._id);
	});
});

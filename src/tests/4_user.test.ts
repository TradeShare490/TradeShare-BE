import { expect } from "chai";
import { UserDocument } from "../db/models/user.model";
import UserService from "../db/service/user.service";
import UserCollection from "../db/models/user.model";
import UserInfoCollection from "../db/models/userInfo.model";
describe("User service can", () => {
	let mockedUser: UserDocument;
	let userService: UserService;

	it("be setup", () => {
		userService = new UserService(UserCollection, UserInfoCollection);
		expect(userService).not.equal(undefined);
	});

	it("create a new user", async () => {
		const input = { email: "ken@email.com", password: "ken123456" };
		let response: any;
		try {
			response = await userService.createUser(input);
		} catch (error) {
			console.error(error);
		}
		expect(response).to.have.property("user");
		expect(response.user).to.have.property("_id");
		expect(response.user).to.have.property("email");
		expect(response.user.email).to.equal(input.email);
		mockedUser = response.user;
	});

	it("get the user by id", async () => {
		const res = await userService.getUser({ id: mockedUser._id });
		expect(res.success).to.be.true;
		expect(res).to.have.property("user");

		expect(res.user._id).not.to.equal(undefined);
	});

	it("get the user by username", async () => {
		const res = await userService.getUser({ email: mockedUser.email });
		expect(res.success).to.be.true;
		expect(res).to.have.property("user");
		expect(res.user.email).to.equal(mockedUser.email);
	});

	it("update user profile by id", async () => {
		const updateInput = { password: "4567" };
		const res = await userService.updateUser(mockedUser._id, updateInput);
		expect(res.success).to.be.true;
		expect(res.user).to.have.property("password");
		expect(res.user.password).to.equal(updateInput.password);
	});

	it("delete a user by id", async () => {
		let response: any;
		try {
			response = await userService.deleteUser(mockedUser._id);
		} catch (error) {
			console.error(error);
		}
		expect(response).not.equal(undefined);
		expect(response).to.have.property("deletedCount");
		expect(response.deletedCount).to.equal(1);
	});
});

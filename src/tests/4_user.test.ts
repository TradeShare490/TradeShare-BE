import { expect } from "chai";
import { LoginUser } from "../db/models/LoginUser.model";
import UserService from "../services/User.service";

describe("User service can", () => {
	let mockedUser: LoginUser;
	let userService: UserService;

	it("be setup", () => {
		userService = new UserService();
		expect(userService).not.equal(undefined);
	});

	it("create a new user", async () => {
		const input = { email: "ken", password: "1234" };
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
		expect(response.user).to.have.property("password");
		expect(response.user.password).to.equal(input.password);
		mockedUser = response.user;
	});

	it("get the user by id", async () => {
		const res = await userService.getUser({ id: mockedUser._id });
		expect(res.success).to.be.true;
		expect(res).to.have.property("user");

		expect(res.user._id).not.to.equal("undefined");
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
		expect(response).not.equal("undefined");
		expect(response).to.have.property("deletedCount");
		expect(response.deletedCount).to.equal(1);
	});
});

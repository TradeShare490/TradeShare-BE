import { expect } from "chai";
import { UserDocument } from "../db/models/user.model";
import UserService from "../db/service/user.service";
import UserCollection from "../db/models/user.model";

interface CreateUserInput {
	email: string;
	password: string;
	username: string;
}

describe("User service can", () => {
	let mockedUser: UserDocument;
	let userService: UserService;
	let input: CreateUserInput;

	it("be setup", () => {
		userService = new UserService(UserCollection);
		expect(userService).not.equal(undefined);
	});

	it("create a new user", async () => {
		let response: any;
		try {
			const crypto = await import("crypto");
			const buff = crypto.randomBytes(5); // Compliant for security-sensitive use cases
			input = { email: "ken@email.com", password: buff.toString("hex"), username: "kentest" };
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

	it("get the user by email", async () => {
		const res = await userService.getUser({ email: mockedUser.email });
		expect(res.success).to.be.true;
		expect(res).to.have.property("user");
		expect(res.user.email).to.equal(input.email);
	});

	it("get the user by username", async () => {
		const res = await userService.getUser({ username: input.username });
		expect(res.success).to.be.true;
		expect(res).to.have.property("user");
		expect(res.user.username).to.equal(input.username);
	});

	it("can't get the user without username or email", async () => {
		const res = await userService.getUser({});
		expect(res.success).to.be.false;
		expect(res.status).to.equal(400);
	});

	it("update user profile by id", async () => {
		const updateInput = { password: "4567" };
		const res = await userService.updateUser(mockedUser._id, updateInput);
		expect(res.success).to.be.true;
		expect(res.user).to.have.property("password");
		expect(res.user.password).to.equal(updateInput.password);
	});

	it("can't update unknown user", async () => {
		const updateInput = { email: "test@abcdef.com" };
		const res = await userService.updateUser("unknown", updateInput);
		expect(res.success).to.be.false;
		expect(res.status).to.equal(501);
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

	it("can't delete a user by an unknown id", async () => {
		let response: any;
		response = await userService.deleteUser("fakeId123");
		expect(response.success).to.be.false;
		expect(response.status).to.equal(501);
	});
});

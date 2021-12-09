import { expect } from "chai";
import { SessionDocument } from "../db/models/session.model";
import SessionService from "../db/service/session.service";
import UserService from "../db/service/user.service";
import { signJwt } from "../utils/authentication/jwt.utils";
import UserCollection from "../db/models/user.model";

describe.only("Session service can", () => {
	let mockedSession: SessionDocument;
	let sessionService: SessionService;
	let userService: UserService;
	let user: any;
	it("be setup", async () => {
		sessionService = new SessionService();
		userService = new UserService(UserCollection);
		user = await userService.createUser({
			email: "sessionTest10@email.com",
			password: "ken123456",
		});
		expect(sessionService).not.equal(undefined);
	});

	it("create a new session", async () => {
		let response: any;
		try {
			response = await sessionService.createSession(user.user._id.toHexString(), "fakeUserAgent");
		} catch (error) {
			console.error(error);
		}
		expect(response).to.have.property("userId");
		expect(response).to.have.property("_id");
		expect(response).to.have.property("valid");
		expect(response).to.have.property("userAgent");
		expect(response.userId.toHexString()).to.equal(user.user._id.toHexString());
		mockedSession = response;
	});

	it("get session", async () => {
		const res = await sessionService.findSessions({ _id: mockedSession._id });
		const responseSession = res[0];
		expect(res).not.to.equal(undefined);
		expect(responseSession.userId.toHexString()).to.equal(mockedSession.userId.toHexString());
		expect(responseSession._id.toHexString()).to.equal(mockedSession._id.toHexString());
		expect(responseSession.valid).to.equal(mockedSession.valid);
	});

	it("reissue token", async () => {
		//create refresh token
		const refreshToken = signJwt(
			{
				session: mockedSession._id,
			},
			{ expiresIn: "1y" }
		);
		const res = await sessionService.reIssueAccessToken({ refreshToken });
		expect(res).not.equal(undefined);
		expect(res).not.equal(false);
	});

	it("kill session", async () => {
		const res = await sessionService.updateSession({ _id: mockedSession._id }, { valid: false });
		expect(res).not.equal(undefined);
		expect(res).to.have.property("modifiedCount");
		expect(res.modifiedCount).to.equal(1);
		const sessions = await sessionService.findSessions({ _id: mockedSession._id });
		const modifiedSession = sessions[0];
		expect(modifiedSession.valid).equal(false);
	});

	it("Clean up", async () => {
		userService.deleteUser(user.user._id);
	});
});

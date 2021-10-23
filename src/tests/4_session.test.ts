import { expect } from "chai";
import { SessionDocument } from "../db/models/session.model";
import SessionService from "../db/service/session.service";

describe("Session service can", () => {
	let mockedSession: SessionDocument;
	let sessionService: SessionService;
	const fakeID = "616923a0685d2440fcf76d36";
	it("be setup", () => {
		sessionService = new SessionService();
		expect(sessionService).not.equal(undefined);
	});

	it("create a new session", async () => {
		let response: any;
		try {
			response = await sessionService.createSession(fakeID, "fakeUserAgent");
		} catch (error) {
			console.error(error);
		}
		expect(response).to.have.property("userId");
		expect(response).to.have.property("_id");
		expect(response).to.have.property("valid");
		expect(response).to.have.property("userAgent");
		expect(response.userId.toHexString()).to.equal(fakeID);
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

	it("update session", async () => {
		const res = await sessionService.updateSession({ _id: mockedSession._id }, { valid: false });
		expect(res).not.equal(undefined);
		expect(res).to.have.property("modifiedCount");
		expect(res.modifiedCount).to.equal(1);
		const sessions = await sessionService.findSessions({ _id: mockedSession._id });
		const modifiedSession = sessions[0];
		expect(modifiedSession.valid).equal(false);
	});
});

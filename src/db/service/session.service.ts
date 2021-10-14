import SessionModel from "../models/session.model";

export default class SessionService {
	constructor() {}

	async createSession(userID: string, userAgent: string) {
		const session = await SessionModel.create({ user: userID, userAgent });

		return session.toJSON();
	}
}

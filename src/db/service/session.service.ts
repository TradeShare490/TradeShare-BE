import { FilterQuery, UpdateQuery } from "mongoose";
import SessionModel, { SessionDocument } from "../models/session.model";
export default class SessionService {
	constructor() {}

	async createSession(userID: string, userAgent: string) {
		const session = await SessionModel.create({ userId: userID, userAgent });

		return session.toJSON();
	}

	async findSessions(query: FilterQuery<SessionDocument>) {
		return SessionModel.find(query).lean();
	}

	async updateSession(query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
		return SessionModel.updateOne(query, update);
	}

}

import SessionService from "../db/service/session.service";
import { Request, Response } from "express";
import UserService from "../db/service/user.service";
import UserCollection from "../db/models/user.model";
import UserInfoCollection from "../db/models/userInfo.model";
import { signJwt } from "../utils/authentication/jwt.utils";
import { messages } from "../db/messages";

class SessionController {
	private sessionService: SessionService;
	private userService: UserService;
	constructor() {
		this.sessionService = new SessionService();
		this.userService = new UserService(UserCollection, UserInfoCollection);
	}

	async createSession(req: Request, res: Response) {
		const user = await this.userService.validatePassword(req.body);

		if (!user) {
			const payload =  messages.notAuthorized();
			return res.status(payload.status).send(payload);
		}

		const session = await this.sessionService.createSession(user._id, req.get("user-agent") || "");

		const accessToken = signJwt(
			{
				...user,
				session: session._id,
			},
			{ expiresIn: "15m" }
		);

		//create refresh token
		const refreshToken = signJwt(
			{
				...user,
				session: session._id,
			},
			{ expiresIn: "15m" }
		);

		return res.send({ accessToken, refreshToken });
	}

	async getSession(req: Request, res: Response) {
		const userId = res.locals.user._id;
		const sessions = await this.sessionService.findSessions({ userId: userId, valid: true });
		return res.send(sessions);
	}

	async deleteSession(req: Request, res: Response) {
		const sessionID = res.locals.user.session;
		await this.sessionService.updateSession({ _id: sessionID }, { valid: false });
		return res.send({
			accessToken: null,
			refreshToken: null,
		});
	}
}

export default SessionController;

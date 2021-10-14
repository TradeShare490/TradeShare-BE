import SessionService from "../db/service/session.service";
import { Request, Response } from "express";
import UserService from "../db/service/user.service";
import UserCollection from "../db/models/user.model";
import UserInfoCollection from "../db/models/userInfo.model";
import { signJwt } from "../utils/authentication/jwt.utils";

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
			return res.status(401).send("Invalid email or password");
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
}

export default SessionController;
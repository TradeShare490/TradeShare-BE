import SessionService from '../db/service/SessionService'
import { Request, Response } from 'express'
import UserService from '../db/service/UserService'
import UserCollection from '../db/models/user.model'
import UserInfoCollection from '../db/models/userInfo.model'
import { signJwt } from '../utils/authentication/jwt.utils'
import { messages } from '../db/messages'
import UserInfoService from '../db/service/UserInfoService'

class SessionController {
	private sessionService: SessionService;
	private userInfoService: UserInfoService;
	private userService: UserService;
	constructor () {
		this.userService = new UserService(UserCollection)
		this.sessionService = new SessionService()
		this.userInfoService = new UserInfoService(UserInfoCollection)
	}

	async createSession (req: Request, res: Response) {
		const user = await this.userService.validatePassword(req.body)

		if (!user) {
			const payload = messages.internalError('Incorrect Credentials')
			return res.status(payload.status).send(payload)
		}

		const session = await this.sessionService.createSession(user._id, req.get('user-agent') || '')
		const userInfo = await this.userInfoService.findUserInfo({ userId: session.userId })
		const accessToken = signJwt(
			{
				...user,
				session: session._id
			},
			{ expiresIn: '15m' }
		)

		// create refresh token
		const refreshToken = signJwt(
			{
				...user,
				session: session._id
			},
			{ expiresIn: '1y' }
		)

		return res.send({ accessToken, refreshToken, userInfo })
	}

	async getSession (req: Request, res: Response) {
		const userId = res.locals.user._id
		const sessions = await this.sessionService.findSessions({ userId: userId, valid: true })
		return res.send(sessions)
	}

	async deleteSession (req: Request, res: Response) {
		const sessionID = res.locals.user.session
		await this.sessionService.updateSession({ _id: sessionID }, { valid: false })
		return res.send({
			accessToken: null,
			refreshToken: null
		})
	}
}

export default SessionController

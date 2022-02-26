import { FilterQuery, UpdateQuery } from 'mongoose'
import { get } from 'lodash'
import { verifyJwt, signJwt } from '../../utils/authentication/jwt.utils'
import SessionModel, { SessionDocument } from '../models/session.model'
import UserService from './UserService'
import UserCollection from '../models/user.model'

export default class SessionService {
	private userService: UserService;
	constructor () {
		this.userService = new UserService(UserCollection)
	}

	async createSession (userID: string, userAgent: string) {
		const session = await SessionModel.create({ userId: userID, userAgent })

		return session.toJSON()
	}

	async findSessions (query: FilterQuery<SessionDocument>) {
		return SessionModel.find(query).lean()
	}

	async updateSession (query: FilterQuery<SessionDocument>, update: UpdateQuery<SessionDocument>) {
		return SessionModel.updateOne(query, update)
	}

	async reIssueAccessToken ({ refreshToken }: { refreshToken: string }) {
		const { decoded } = verifyJwt(refreshToken)
		if (!decoded || !get(decoded, 'session')) return false

		const session = await SessionModel.findById(get(decoded, 'session'))

		if (!session || !session.valid) return false

		const user = await this.userService.findUser({ _id: session.userId })

		if (!user) return false

		const accessToken = signJwt(
			{
				...user,
				session: session._id
			},
			{ expiresIn: '15m' }
		)

		return accessToken
	}
}

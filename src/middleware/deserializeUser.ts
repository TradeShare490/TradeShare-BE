import { NextFunction, Request, Response } from 'express'
import { get } from 'lodash'
import { verifyJwt } from '../utils/authentication/jwt.utils'
import SessionService from '../db/service/SessionService'
import { InternalError } from '../utils/ErrorSchema/ErrorSchema'

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
	const sessionService = new SessionService()

	const accessToken = get(req, 'headers.authorization', '').replace(/^Bearer\s/, '')

	const refreshToken = get(req, 'headers.x-refresh')
	if (accessToken) {
		const { decoded, expired } = verifyJwt(accessToken)
		if (decoded) {
			req.app.locals.user = decoded
		}

		if (expired && refreshToken) {
			const newAccessToken = await sessionService.reIssueAccessToken({ refreshToken })
			if (newAccessToken) {
				res.setHeader('x-access-token', newAccessToken)
			}

			const result = verifyJwt(newAccessToken as string)

			req.app.locals.user = result.decoded
		}
	}

	if (!accessToken) return next(new InternalError('NO access token detected here'))
	return next()
}

export default deserializeUser

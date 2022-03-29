import { NextFunction, Request, Response } from 'express'
import { isUndefined } from 'lodash'
import { BadInputError, InternalError } from '../../utils/ErrorSchema/ErrorSchema'
import FollowRequestService from './FollowRequestService'

class FollowRequestController {
	static verifyRelId (req: Request, res: Response, next: NextFunction) {
		const relId = !isUndefined(req?.params?.relId) || !isUndefined(req?.body?.relId)
			? (req.params.relId || req.body.relId)
			: undefined

		if (isUndefined(relId)) return next(new BadInputError('relationship id is not passed'))
		else if (isNaN(relId)) return next(new BadInputError('relationship id contains only number'))
		else next()
	}

	static verifyUserId (req: Request, res: Response, next: NextFunction) {
		const userId = req?.params?.userId !== undefined || req?.body?.userId !== undefined
			? req.params.userId || req.body.userId
			: undefined

		if (!userId) return next(new BadInputError('user id is undefined'))
		else next()
	}

	static async declinePendingRequest (req: Request, res: Response, next: NextFunction) {
		const response = await FollowRequestService.declinePendingRequest(Number.parseInt(req.params.relId || req.body.relId))
		return response.success ? res.send(response.data) : next(new InternalError(response.message))
	}

	static async acceptPendingRequest (req: Request, res: Response, next: NextFunction) {
		const response = await FollowRequestService.acceptPendingRequest(Number.parseInt(req.params.relId || req.body.relId))
		return response.success ? res.send(response.data) : next(new InternalError(response.message))
	}

	static async getPendingRequests (req: Request, res: Response, next: NextFunction) {
		const response = await FollowRequestService.getPendingRequests(req.params.userId || req.body.userId)
		return response.success ? res.send(response.data) : next(new InternalError(response.message))
	}
}

export default FollowRequestController

import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../utils/ErrorSchema/ErrorSchema'

const requireUser = (req: Request, res: Response, next: NextFunction) => {
	const user = res.locals.user
	if (!user) {
		return next(new UnauthorizedError())
	}
	return next()
}

export default requireUser

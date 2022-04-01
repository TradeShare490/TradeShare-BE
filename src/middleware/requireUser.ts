import { NextFunction, Request, Response } from 'express'
import { UnauthorizedError } from '../utils/ErrorSchema/ErrorSchema'

const requireUser = (req: Request, res: Response, next: NextFunction) => {
	return req.app.locals.user ? next() : next(new UnauthorizedError())
}

export default requireUser

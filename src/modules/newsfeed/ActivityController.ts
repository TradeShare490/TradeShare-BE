import { Response, Request } from 'express'
import { MockedData } from './MockedData'

export class ActivityController {
	static getActivities (req:Request, res:Response) {
		res.send(MockedData.getAllPosts())
	}
}

import { Request, Response } from 'express'
import UserInfoService from '../db/service/UserInfoService'
import UserInfoCollection from '../db/models/userInfo.model'
import mongoose from 'mongoose'
import { messages } from '../db/messages'
import AlpacaService from '../db/service/AlpacaService'

class ActivitiesController {
	private userInfoService: UserInfoService;
	private alpacaService: AlpacaService;
	constructor () {
		this.userInfoService = new UserInfoService(UserInfoCollection)
		this.alpacaService = new AlpacaService()
	}

	async getActivities (req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId)
		const userInfo = await this.userInfoService.findUserInfo({ userId: userId })
		if (userInfo?.alpacaToken || userInfo?.alpacaToken === 'None') {
			return res.send(
				await this.alpacaService.getInfo(
					'/account/activities/FILL',
					'activities',
					userInfo.alpacaToken
				)
			)
		} else {
			return res.send(messages.internalError("User hasn't linked any Alpaca account"))
		}
	}
}

export default ActivitiesController
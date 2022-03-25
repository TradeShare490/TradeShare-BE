import { Request, Response } from 'express'
import UserInfoService from '../db/service/UserInfoService'
import UserInfoCollection from '../db/models/userInfo.model'
import mongoose from 'mongoose'
import { messages } from '../db/messages'
import AlpacaService from '../db/service/AlpacaService'

class PorfolioHistoryController {
	private userInfoService: UserInfoService;
	private alpacaService: AlpacaService;
	constructor () {
		this.userInfoService = new UserInfoService(UserInfoCollection)
		this.alpacaService = new AlpacaService()
	}

	async getHistory (req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId)

		const period = req.body.period ?? '1M'

		const userInfo = await this.userInfoService.findUserInfo({ userId: userId })
		if (userInfo?.alpacaToken || userInfo?.alpacaToken === 'None') {
			return res.send(
				await this.alpacaService.getInfo(`/account/portfolio/history?extended_hour=true&period=${period}`, 'history', userInfo.alpacaToken)
			)
		} else {
			return res.send(messages.internalError("User hasn't linked any Alpaca account"))
		}
	}
}

export default PorfolioHistoryController

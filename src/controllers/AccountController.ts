import { Request, Response } from 'express'
import UserInfoService from '../db/service/UserInfoService'
import UserInfoCollection from '../db/models/userInfo.model'
import mongoose from 'mongoose'
import { messages } from '../db/messages'
import AlpacaService from '../db/service/AlpacaService'

class AccountController {
	private userInfoService: UserInfoService;
	private alpacaService: AlpacaService;
	constructor () {
		this.userInfoService = new UserInfoService(UserInfoCollection)
		this.alpacaService = new AlpacaService()
	}

	async getAccount (req: Request, res: Response) {
		try {
			const userId = new mongoose.Types.ObjectId(req.params.userId)
			const userInfo = await this.userInfoService.findUserInfo({ userId: userId })
			if (!userInfo?.userId) {
				return res.status(404).send('User not found')
			}

			if (userInfo.alpacaToken || userInfo?.alpacaToken !== 'None') {
				return res.send(
					await this.alpacaService.getInfo('/account', 'account', userInfo.alpacaToken)
				)
			} else {
				return res.send(messages.internalError("User hasn't linked any Alpaca account"))
			}
		} catch (error: any) {
			return res.send(messages.internalError(error.message))
		}
	}
}

export default AccountController

import { Request, Response } from 'express'
import UserInfoCollection from '../db/models/userInfo.model'
import UserInfoService from '../db/service/UserInfoService'
import mongoose from 'mongoose'
import axios from 'axios'

class UserInfoController {
	private userInfoService: UserInfoService;

	constructor () {
		this.userInfoService = new UserInfoService(UserInfoCollection)
	}

	async getUserInfo (req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId)

		return res.send(await this.userInfoService.findUserInfo({ userId: userId }))
	}

	async getUserInfos (req: Request, res: Response) {
		const result = await this.userInfoService.getUserInfos(req.query)
		return result.success ? res.send(result) : res.status(400).send(result)
	}

	async updateUserInfo (req: Request, res: Response) {
		const userId = new mongoose.Types.ObjectId(req.params.userId)
		const updatedInfo = await this.userInfoService.updateUserInfo({ userId: userId }, req.body, {
			new: true
		})
		return res.send(updatedInfo)
	}

	async updateAlpacaToken (req: Request, res: Response) {
		const clientId = process.env.CLIENT_ID as string
		const clientSecret = process.env.CLIENT_SECRET as string
		const redirectURI = process.env.REDIRECT_URI as string
		const code = req.body.code
		const userId = new mongoose.Types.ObjectId(req.params.userId)
		const params = new URLSearchParams()
		params.append('grant_type', 'authorization_code')
		params.append('code', code)
		params.append('client_id', clientId)
		params.append('client_secret', clientSecret)
		params.append('redirect_uri', redirectURI)

		try {
			const { data } = await axios.post('https://api.alpaca.markets/oauth/token', params, {
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			if (!data.access_token) {
				return res.status(500).send('No token')
			}
			const alpacaToken = data.access_token
			const updatedInfo = await this.userInfoService.updateUserInfo(
				{ userId: userId },
				{ alpacaToken: alpacaToken },
				{
					new: true
				}
			)

			return res.send(updatedInfo)
		} catch (error: any) {
			return res.send(error.response.data.message)
		}
	}
}

export default UserInfoController

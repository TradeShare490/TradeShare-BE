import axios from "../../utils/axios/axios.v1";
import { Request, Response } from "express";
import { messages } from "../../db/messages";
export default class AlpacaService {
	constructor() {}

	async getInfo(
		req: Request,
		res: Response,
		endPoint: string,
		infoType: string,
		alpacaToken: string
	) {
		try {
			const { data } = await axios.get(endPoint, {
				headers: { Authorization: `Bearer ` + alpacaToken },
			});

			return res.send(messages.successMessage("success", infoType, data));
		} catch (error: any) {
			return res.send(messages.internalError(error.response.data.message));
		}
	}
}

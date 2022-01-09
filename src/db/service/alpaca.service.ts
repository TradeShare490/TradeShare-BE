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
			let alpacaInfo = {};
			const response = await axios.get(endPoint, {
				headers: { Authorization: `Bearer ` + alpacaToken },
			});
			alpacaInfo = response.data;
			return res.send(messages.successMessage("success", infoType, alpacaInfo));
		} catch (error: any) {
			return res.send(messages.internalError(error.response.data.message));
		}
	}
}

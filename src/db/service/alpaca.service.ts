import axios from "../../utils/axios/axios.v1";
import { messages } from "../../db/messages";
export default class AlpacaService {
	async getInfo(endPoint: string, infoType: string, alpacaToken: string) {
		try {
			const { data } = await axios.get(endPoint, {
				headers: { Authorization: `Bearer ` + alpacaToken },
			});

			return messages.successMessage("success", infoType, data);
		} catch (error: any) {
			return messages.internalError(error.response.data.message);
		}
	}
}

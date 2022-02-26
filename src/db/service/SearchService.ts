import axios from "../../utils/axios/axios.v1";
import { messages } from "../messages";
export default class SearchService {
	constructor() {
        // This is intentional
    }

	async getStockSuggestions(
		url: string,
        searchString: string,

	) {
		try{
            if(process.env.ALPHAVANTAGE_API_KEY == undefined) {
                throw new Error("Alphavantage api key is undefined");
            }
			const {data}= await axios.get(`${url}&keywords=${searchString}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`, {
				headers: { 'User-Agent': 'request' },
			});
			return messages.successMessage("success", "searchResult", data);
		}
		catch (error: any) {
			/* istanbul ignore else  */
            if(error.response == undefined) {
                return messages.internalError(error.message);
            } else {
                return messages.internalError(error.response.data.message);
            } 
		}
		
	}
}
import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "../utils/axios/axios.v1";
import { messages } from "../db/messages";

class SearchController {    
	async getStocksSuggestions(req: Request, res: Response) {
		const searchString = req.params.searchString;
        const url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH'
		let searchResults = {};
		
		try{
            if(process.env.ALPHAVANTAGE_API_KEY == undefined) {
                throw new Error("Alphavantage api key is undefined");
            }
			const response = await axios.get(`${url}&keywords=${searchString}&apikey=${process.env.ALPHAVANTAGE_API_KEY}`, {
				headers: { 'User-Agent': 'request' },
			});
			searchResults = response.data;
			return res.send(messages.successMessage("success", "searchResult", searchResults))
		}
		catch (error: any) {
			 res.send(messages.internalError(error.response.data.message));
		}
	}
}

export default SearchController;
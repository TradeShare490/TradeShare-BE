import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "../utils/axios/axios.v1";
import { messages } from "../db/messages";
import SearchService from "../db/service/search.service";

class SearchController {   
	private searchService: SearchService;
	constructor() {
		this.searchService = new SearchService();
	}
	async getStocksSuggestions(req: Request, res: Response) {
		const searchString = req.params.searchString;
        const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH`		
		
		return res.send(await this.searchService.getStockSuggestions(url, searchString));
	}
}

export default SearchController;
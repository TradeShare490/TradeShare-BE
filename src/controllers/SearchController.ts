import { Request, Response } from 'express'
import SearchService from '../db/service/SearchService'

class SearchController {
	private searchService: SearchService;
	constructor () {
	  this.searchService = new SearchService()
	}

	async getStocksSuggestions (req: Request, res: Response) {
	  const searchString = req.params.searchString
	  const url = 'https://www.alphavantage.co/query?function=SYMBOL_SEARCH'

	  return res.send(await this.searchService.getStockSuggestions(url, searchString))
	}
}

export default SearchController

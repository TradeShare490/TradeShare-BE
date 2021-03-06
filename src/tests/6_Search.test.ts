import { expect } from 'chai'
import SearchService from '../db/service/SearchService'

describe('Search service can', () => {
	let searchService: SearchService
	it('be set up', () => {
		searchService = new SearchService()
		expect(searchService).not.equal(undefined)
	})

	it('can get search suggestions based on a string', async () => {
		const response = await searchService.getStockSuggestions('https://www.alphavantage.co/query?function=SYMBOL_SEARCH', 'tsl')
		expect(response.status).equals(200)
		expect(response.success).equals(true)
		expect(response.message).equals('success')
	})

	it('can throw an internal error if the api key is undefined', async () => {
		delete process.env.ALPHAVANTAGE_API_KEY
		const response = await searchService.getStockSuggestions('https://www.alphavantage.co/query?function=SYMBOL_SEARCH', 'tsl')
		expect(response.status).equals(501)
		expect(response.success).equals(false)
	})
})

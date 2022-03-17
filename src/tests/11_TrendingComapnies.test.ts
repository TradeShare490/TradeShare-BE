import { expect } from 'chai'
import TrendingCompaniesService from '../db/service/trendingCompaniesService'

describe('Trending Companies service can', () => {
	let trendingCompaniesService: TrendingCompaniesService
	it('be setup', async () => {
		trendingCompaniesService = new TrendingCompaniesService()
	})

	it('can successfully pull data from the API', async () => {
		const response = await trendingCompaniesService.getTrendingCompanies()
		expect(response.status).equals(200)
		expect(response.success).equals(true)
		expect(response.trendingCompanies.length).equals(10)
	})
})

import { expect } from 'chai'
import TrendingCompaniesService from '../db/service/trendingCompaniesService'

describe.only('Trending Companies service can', () => {
    let trendingCompaniesService: TrendingCompaniesService
	it('be setup', async () => {
        trendingCompaniesService = new TrendingCompaniesService();
	})

    it('can successfully pull data from the API',async()=>{
        const response = await trendingCompaniesService.getTrendingCompanies();
        expect(response.message.length).equals(10);
        expect(response.status).equals(200);
        expect(response.success).equals(true);
    })
})

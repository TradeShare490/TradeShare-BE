import { expect } from "chai";
import SearchService from "../db/service/search.service";

describe("Search service can", () => {
    let searchService: SearchService;
    it("be set up", () => {
        searchService = new SearchService();
    });

    it("can get search suggestions based on a string", async () => {
        let response = await searchService.getStockSuggestions(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH`, 'tsl')
        expect(response.status).equals(200);
        expect(response.success).equals(true);
		expect(response.message).equals("success");
    })
})
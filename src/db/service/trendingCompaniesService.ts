import axios from '../../utils/axios/axios.v1'
import { messages } from '../messages'
export default class TrendingCompaniesService {
    async getTrendingCompanies () {
        try {
            if (process.env.RAPID_KEY === undefined) {
                throw new Error('RAPID api key is undefined')
            }
            const { data } = await axios.get('https://yh-finance.p.rapidapi.com/market/get-trending-tickers', {
                headers: {
                    'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
                    'x-rapidapi-key': process.env.RAPID_KEY as string
                },
                params: {
                    region: 'CA'
                }
            })
            var trendingList = [];
            const entry = data.finance.result[0].quotes
            for (let index = 0; index < 10; index++) {
                let info = {
                    "stock_name":entry[index].shortName,
                    "stock_symbol":entry[index].symbol,
                    "current_price":entry[index].regularMarketPrice,
                    "price_variation":entry[index].regularMarketChange,
                    "price_variation_percentage":entry[index].regularMarketChangePercent
                }
                trendingList.push(info);
            }
            return messages.successMessage('success', 'trendingCompanies', trendingList) 
        } catch (error: any) {
            /* istanbul ignore else  */
            if (error.response === undefined) {
                return messages.internalError(error.message)
            } else {
                return messages.internalError(error.response.data.message)
            }
        }
    }
}
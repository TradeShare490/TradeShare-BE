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
            
            // filter data here
           /* var trendingList = [];
            for (let index = 0; index < 10; index++) {
                trendingList.push(data.finance.result[index])
            }
            return messages.successMessage('success', 'trendingCompanies', trendingList) */
            return messages.successMessage('success', 'trendingCompanies', data)
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
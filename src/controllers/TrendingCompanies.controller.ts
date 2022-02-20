function showTrendingCompanies(){
    var axios = require("axios").default;

    var options = {
      method: 'GET',
      url: 'https://yh-finance.p.rapidapi.com/market/get-trending-tickers',
      params: {region: 'CA'},
      headers: {
        'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
        'x-rapidapi-key': process.env.RAPID_KEY
      }
    };
    
    axios.request(options).then(function (response: { data:any }) {
        console.log(response.data);
        var stock_information = [];
        const list = response.data.finance.result.quotes;
        for (let index = 0; index < 10; index++) {
            stock_information.push(list[index]);
        }
        return stock_information;
    }).catch(function (error: any) {
        console.error(error);
    });

}

export default showTrendingCompanies
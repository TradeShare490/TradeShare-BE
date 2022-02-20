function showTrendingCompanies(){
    var axios = require("axios").default;

    var options = {
      method: 'GET',
      url: 'https://yh-finance.p.rapidapi.com/market/get-trending-tickers',
      params: {region: 'CA'},
      headers: {
        'x-rapidapi-host': 'yh-finance.p.rapidapi.com',
        'x-rapidapi-key': '4bcf5c8155mshdd067ed153a9d3fp14a3e6jsnc8b2bbdacfae'
      }
    };
    
    axios.request(options).then(function (response: { data:any }) {
        console.log(response.data);
        var stock_information = [];
        const list = response.data.finance.result.quotes;
        for (let index = 0; index < 19; index++) {
            stock_information.push(list[index]);
        }
        return stock_information;
    }).catch(function (error: any) {
        console.error(error);
    });

}

export default showTrendingCompanies
const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');

const client = new Client({ node: 'http://localhost:9200' });
const API_KEY = 'd681ee4ea99c0f7898c3784878e7d54c6a57ee7e80d6fed5d3897642fb154e86';
const tokens = ['XRP', 'BTC', 'ETH'];
async function getRecordFromElasticCache(date) {
    const searchTokens = tokens.map(token => (client.search({
        index: 'transactions_record',
        body: {
            "query": {
                "bool": {
                    "filter": [
                        {
                            "term": {
                                "token.keyword": token
                            }
                        },
                        {
                            "term": {
                                "timestamp.keyword": date
                            }
                        }
                    ]

                }
            }
        }
    })));
    const results = await Promise.all(searchTokens);
    let perTokenAmount = {}
    results.map(result => {
        if (result.body.hits.hits.length){
            perTokenAmount[result.body.hits.hits[0]._source.token] = result.body.hits.hits[0]._source.amount;
        }
        return;         
    });
    return perTokenAmount;
}
module.exports = (date) => {
    getRecordFromElasticCache(date)
        .then(perTokenamount => getExchangeRateForGivenTokenInUSD(perTokenamount))
        .then(value => {
            console.log(`The ${token} token value is ${value} in USD`);
            return;
        })

}
async function getExchangeRateForGivenTokenInUSD(perTokenamount) {
    const axiosGetRequest = Object.keys(perTokenamount).map(token => httpGetCall(token));
    return axios.all(axiosGetRequest).then(axios.spread((...response) => {
        let tokenAmountInUSD = Object.keys(perTokenamount).map((token, index) => response[index].data.USD * perTokenamount[token]);
        return tokenAmountInUSD;
    })).catch(error => {
        console.log(error);
    });
}
function httpGetCall(token) {
    return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${API_KEY}`);
}
// module.exports = getLatestPortfolioForToken;
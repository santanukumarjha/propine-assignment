const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');

const client = new Client({ node: 'http://localhost:9200' });
const API_KEY = 'd681ee4ea99c0f7898c3784878e7d54c6a57ee7e80d6fed5d3897642fb154e86';
async function getRecordFromElasticCache(token) {
    const result = await client.search({
        index: 'transactions_record',
        body: {
            "query": {
                "match": {
                    "token": token
                }
            },
            "sort": [
                {
                    "timestamp": {
                        "order": "asc"
                    }
                }
            ],
            "size": 1
        }
    });
    console.log(`amount ${result.body.hits.hits[0]._source.amount}`);
    return result.body.hits.hits[0]?._source.amount;

    // console.log(JSON.stringify(results, null, 2));
}
module.exports = (token) => {
    getRecordFromElasticCache(token)
        .then(amount => getExchangeRateForGivenTokenInUSD(token, amount))
        .then(value => {
            console.log(`The ${token} token value is ${value} in USD`);
            return;
        })

};
async function getExchangeRateForGivenTokenInUSD(token, amount) {
    const axiosGetRequest = httpGetCall(token);
    return axios.all([axiosGetRequest]).then(axios.spread((response1) => {
        console.log('zagsasdg', response1.data.USD);
     return response1.data.USD * amount;
    })).catch(error => {
      console.log(error);
    });
}
function httpGetCall(token){
    return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${API_KEY}`);
}
// module.exports = getLatestPortfolioForToken;
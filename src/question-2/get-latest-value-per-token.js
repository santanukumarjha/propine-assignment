const { Client } = require('@elastic/elasticsearch');
const axios = require('axios');

const client = new Client({ node: 'http://localhost:9200' });
const API_KEY = 'd681ee4ea99c0f7898c3784878e7d54c6a57ee7e80d6fed5d3897642fb154e86';
const tokens = ['XRP', 'BTC', 'ETH'];
async function getRecordFromElasticCache() {
    const searchTokens = tokens.map(token => (client.search({
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
    })));
    const results = await Promise.all(searchTokens);
    let perTokenAmount = {}
    results.map(result => {
        if(result.body.hits.hits[0])
            perTokenAmount[result.body.hits.hits[0]._source.token] = result.body.hits.hits[0]._source.amount;
        return result;        
    });
    return perTokenAmount;
}
module.exports = () => {
    getRecordFromElasticCache()
        .then(perTokenamount => getExchangeRateForGivenTokenInUSD(perTokenamount))
        .then(values => {
            console.log(`All ${tokens} token value is ${values} in USD respectively.`);
            return;
        })

};
async function getExchangeRateForGivenTokenInUSD(perTokenamount) {
    const axiosGetRequest = tokens.map(token => httpGetCall(token));
    return axios.all(axiosGetRequest).then(axios.spread((...response) => {
        let tokenAmountInUSD = tokens.map((token, index) => response[index].data.USD * perTokenamount[token]);
        return tokenAmountInUSD;
    })).catch(error => {
        console.log(error);
    });
}
function httpGetCall(token) {
    return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${API_KEY}`);
}
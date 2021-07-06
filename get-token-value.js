var axios = require('axios');
const API_KEY = 'd681ee4ea99c0f7898c3784878e7d54c6a57ee7e80d6fed5d3897642fb154e86';
const tokens = ['XRP','BTC','ETH'];
const axiosGetRequest = tokens.map( token => httpGetCall(token));
axios.all(axiosGetRequest).then(axios.spread((...response) => {
    console.log(response[0].data.USD);
 return [response[0].data.USD, response[1].data.USD, response[2].data.USD];
})).catch(error => {
  console.log(error);
});

function httpGetCall(token){
  return axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${token}&tsyms=USD&api_key=${API_KEY}`);
}
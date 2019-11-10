const axios = require ('axios');
const {authToken} = require('../auth');
const config = require('../../config');

const requestQuote = (symbols, res) => {
    axios
        .request({
            url: 'https://api.tdameritrade.com/v1/marketdata/quotes',
            method: 'GET',
            headers: {
                'Authorization': authToken.access_token,
            },
            params: {
                apikey: config.acct.apikey,
                symbol: symbols //symbol hardcoded for testing - use symbols parameter
            }
        })
        .then( (tdResponse) => {
            console.log(tdResponse.data);
            res.json(tdResponse.data);
        })
        .catch( (err) => {
            console.log(err);
            res.send(`Error Encountered: ${err}`);
            throw err;
        });
};

module.exports = {requestQuote};
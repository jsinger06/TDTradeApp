const axios = require ('axios');
const config = require('../../config');
const debug = require('debug')('tradingapi:routes:quotes');


const requestQuote = (token,symbols) => {
    debug(`start requestQuoteTemp`);
    return new Promise((resolve, reject) => {
        axios
            .request({
                url: 'https://api.tdameritrade.com/v1/marketdata/quotes',
                method: 'GET',
                headers: {
                    'Authorization': token,
                },
                params: {
                    apikey: config.acct.apikey,
                    symbol: symbols //symbol hardcoded for testing - use symbols parameter
                }
            })
            .then((tdResponse) => {
                console.log(tdResponse.data);
                resolve(tdResponse.data);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = {requestQuote};
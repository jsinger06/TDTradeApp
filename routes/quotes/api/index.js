const axios = require ('axios');
const { devAcct } = require('../../config');
const debug = require('debug')('tradingapi:routes:quotesAPI');

const getQuoteAPI = (token,symbols) => {
    debug(`start quoteAPI`);
    return new Promise((resolve, reject) => {
        return axios.get('https://api.tdameritrade.com/v1/marketdata/quotes',
            {
                    headers: { 'Authorization': token },
                    params: {
                        apikey: devAcct.apikey,
                        symbol: symbols
                    }
             })
            .then((quoteResponse) => {
                debug(`quoteAPI successful: ${JSON.stringify(quoteResponse.data, null, 2)}`);
                resolve(quoteResponse.data);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = { getQuoteAPI };
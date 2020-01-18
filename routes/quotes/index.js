const debug = require('debug')('tradingapi:routes:quotes');
const quoteAPI = require('./api');

const requestQuote = (token,symbols) => {
    debug(`start requestQuoteTemp`);
    return new Promise((resolve, reject) => {
        quoteAPI.getQuoteAPI(token, symbols)
            .then((tdResponse) => {
                resolve(tdResponse);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = { requestQuote };
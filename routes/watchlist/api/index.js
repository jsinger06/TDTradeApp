const axios = require ('axios');
const { tradeAcct } = require('../../../config');
const debug = require('debug')('tradingapi:routes:watchlistAPI');

const getWatchlistAPI = (token) => {
    debug(`start getWatchlistAPI`);
    return new Promise((resolve, reject) => {
        return axios.get('https://api.tdameritrade.com/v1/accounts/' + tradeAcct.num + '/watchlists',
            {
                headers: { 'Authorization': token },
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

const createWatchlistAPI = (token, watchlistName) => {
    debug(`start createWatchlistAPI`);

    // watchlist to be created with initialized indices (required by TDameritrade)
    let newWatchList = {
        name: watchlistName,
        watchlistItems: [{
                instrument: {
                    symbol: '$DJI'
                },
                instrument: {
                    symbol: '$COMPX'
                },
                instrument: {
                    symbol: '$SPX.X'
                }
            }]
    };

    return new Promise((resolve, reject) => {
        return axios.post('https://api.tdameritrade.com/v1/accounts/' + tradeAcct.num + '/watchlists',
            newWatchList,
            {
                headers: { 'Authorization': token, 'Content-Type': 'application/json' },
            })
            .then((quoteResponse) => {
                debug(`createWatchlistAPI successful: ${JSON.stringify(quoteResponse.data, null, 2)}`);
                resolve(quoteResponse.data);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = { getWatchlistAPI, createWatchlistAPI };
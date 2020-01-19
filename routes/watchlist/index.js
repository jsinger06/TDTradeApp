const debug = require('debug')('tradingapi:routes:watchlist');
const watchlistAPI = require('./api');

const getWatchlist = (token) => {
    debug(`start getWatchlist`);
    return new Promise((resolve, reject) => {
        watchlistAPI.getWatchlistAPI(token)
            .then((tdResponse) => {
                resolve(tdResponse);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

const createWatchlist = (token, watchlistName) => {
    debug(`start getWatchlist`);
    return new Promise((resolve, reject) => {
        watchlistAPI.createWatchlistAPI(token, watchlistName)
            .then((tdResponse) => {
                resolve(tdResponse);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = { getWatchlist, createWatchlist };
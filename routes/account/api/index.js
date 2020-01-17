const axios = require ('axios');
const { tradeAcct } = require('../../../config');
const debug = require('debug')('tradingapi:routes:acctAPI');

const getAccountAPI = (token) => {
    debug(`getAccountAPI called`);
    return new Promise((resolve, reject) => {
        debug(`getAccountAPI inside promise`);
        return axios.get('https://api.tdameritrade.com/v1/accounts/' + tradeAcct.num,
            {
                headers: {
                    'Authorization': token,
                },
                params: {
                    fields: 'positions,orders'
                }
            })
            .then((acctResponse) => {
                debug(acctResponse.data);
                resolve(acctResponse.data);
            })
            .catch((error) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = { getAccountAPI };
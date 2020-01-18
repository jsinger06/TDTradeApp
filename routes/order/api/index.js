const axios = require ('axios');
const { tradeAcct } = require('../../../config');
const debug = require('debug')('tradingapi:routes:ordersAPI');

const getOrdersAPI = (token) => {
    debug(`start quoteAPI`);
    return new Promise((resolve, reject) => {
        return axios.get('https://api.tdameritrade.com/v1/orders',
            {
                headers: { 'Authorization': token },
                params: {
                    accountId: tradeAcct.num
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

module.exports = { getOrdersAPI };
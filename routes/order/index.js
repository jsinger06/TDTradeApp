const debug = require('debug')('tradingapi:routes:orders');
const orderAPI = require('./api');

const getOrders = (token) => {
    debug(`start getOrders`);
    return new Promise((resolve, reject) => {
        orderAPI.getOrdersAPI(token)
            .then((tdResponse) => {
                resolve(tdResponse);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

module.exports = { getOrders };
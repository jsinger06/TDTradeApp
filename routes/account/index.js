const axios = require ('axios');
const mongoose = require('mongoose');
const { tradeAcct } = require('../../config');
const { acctSchema } = require('../../model/acctModel');

// connect to auth collection
const account = mongoose.model('account', acctSchema);

const getAccount = (token) => {
    axios
        .get({
            url: 'https://api.tdameritrade.com/v1/accounts/' + tradeAcct.num,
            method: 'GET',
            headers: {
                'Authorization': token,
            },
            params: {
                fields: 'positions,orders'
            }
        })
        .then( async (res) => {
            console.log(res.data);
            console.log(`round Trips is ${res.data.securitiesAccount.roundTrips}`);
            let writeDB = {
                roundTrips: res.data.securitiesAccount.roundTrips || 0
            };
            await account.findOneAndUpdate({_id: tradeAcct.userName}, writeDB, { new: true, upsert: true});
        })
        .catch((error) => {
            console.log(error);
            throw new error;
        })
};

module.exports = { getAccount };
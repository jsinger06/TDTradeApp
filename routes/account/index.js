const axios = require ('axios');
const mongoose = require('mongoose');
const { tradeAcct } = require('../../config');
const { acctSchema } = require('../../model/acctModel');

// connect to auth collection
const account = mongoose.model('account', acctSchema);

const getAccount = (token) => {
    return axios.get('https://api.tdameritrade.com/v1/accounts/' + tradeAcct.num,
            {headers: {
                'Authorization': token,
            },
            params: {
                fields: 'positions,orders'
            }}
        )
        .then( async (res) => {
            let acctResponse = res.data.securitiesAccount;

            // console.log(`acctResponse value ${JSON.stringify(acctResponse, null, 2)}`);
            console.log(JSON.stringify(acctResponse, null, 2));
            console.log(`round Trips is ${acctResponse.roundTrips}`);
            console.log(`positions: ${JSON.stringify(acctResponse.positions, null, 2)}`);
            console.log(acctResponse.orderStrategies);
            let writeDB = {
                roundTrips: acctResponse.roundTrips || 0,
                isInCall: acctResponse.initialBalances.isInCall,
                marginBalance: acctResponse.initialBalances.marginBalance,
                accountValue: acctResponse.initialBalances.accountValue,
                longMarginValue: acctResponse.currentBalances.longMarginValue,
                availableFundsNonMarginableTrade: acctResponse.currentBalances.availableFundsNonMarginableTrade,
                buyingPower: acctResponse.currentBalances.buyingPower
            };
            await account.findOneAndUpdate({_id: tradeAcct.userName}, writeDB, { new: true, upsert: true});
        })
        .catch((error) => {
            console.log(error);
            throw new error;
        })
};

module.exports = { getAccount };
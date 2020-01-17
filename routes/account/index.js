const mongoose = require('mongoose');
const { tradeAcct } = require('../../config');
const { acctSchema } = require('../../model/acctModel');
const acctAPI = require('./api/')
const debug = require('debug')('tradingapi:routes:acct');

// connect to auth collection
const account = mongoose.model('account', acctSchema);

const getAccount = (token) => {
    return acctAPI.getAccountAPI(token)
        .then( async (res) => {

            let acctResponse = res.securitiesAccount;

            debug(`Account Response: ${JSON.stringify(acctResponse, null, 2)}`);
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
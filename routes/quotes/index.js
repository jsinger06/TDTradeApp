const axios = require ('axios');
const mongoose = require('mongoose');
const {authToken} = require('../auth');
const config = require('../../config');

const requestQuote = (symbols, res) => {
    axios
        .request({
            url: 'https://api.tdameritrade.com/v1/marketdata/quotes',
            method: 'GET',
            headers: {
                'Authorization': authToken.access_token,
            },
            params: {
                apikey: config.dev.acct.apikey,
                symbol: symbols //symbol hardcoded for testing - use symbols parameter
            }
        })
        .then( async (oAuthReply) => {
            console.log(oAuthReply.data);
            res.json(oAuthReply.data);
        })
        .catch( (err) => {
            console.log(err);
            throw err;
        });
};

module.exports = {requestQuote};
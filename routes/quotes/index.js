const axios = require ('axios');
const mongoose = require('mongoose');
const {authToken} = require('../auth');
const config = require('../../config');

const requestQuote = async (symbols) => {
    await axios
        .request({
            url: 'https://api.tdameritrade.com/v1/marketdata/quotes',
            method: 'GET',
            headers: {
                'Authorization': authToken.access_token,
            },
            params: {
                apikey: config.dev.acct.apikey,
                symbol: 'GOOGL' //symbol hardcoded for testing - use symbols parameter
            }
        })
        .then( async (oAuthReply) => {
            console.log(oAuthReply.data);
        })
        .catch( (e) => {
            console.log(e);
        });
};

module.exports = {requestQuote};
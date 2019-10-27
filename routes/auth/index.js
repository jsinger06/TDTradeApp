const axios = require ('axios');
const mongoose = require('mongoose');
const querystring = require('querystring');
const {authSchema} = require('../../model/authModel');
const config = require('../../config');

// connect to auth collection
const tdauths = mongoose.model('tdauths', authSchema);

// object for auth post request
const options = {
    data: {
        'access_type': 'offline',
        'client_id': config.dev.acct.client_id,
        'redirect_uri': config.dev.acct.redirect_uri
    }
};

/*
    Function for requesting a new or refreshed token
        Stores the returned Access and Refresh tokens in mongo db
*/
const requestToken = async (options) => {
    let data = querystring.stringify(options.data);

    axios
        .request({
            url: 'https://api.tdameritrade.com/v1/oauth2/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data,
        })
        .then( async (oAuthReply) => {
            let currentTime = Date.now();

            authToken.token_created = currentTime;
            authToken.access_token = 'Bearer ' + oAuthReply.data.access_token;

            let writeDB = {
                "token": '1',
                "access_token": oAuthReply.data.access_token,
                "refresh_token": oAuthReply.data.refresh_token,
                'token_created_date': currentTime
            };

            await tdauths.findOneAndUpdate({"token":"1"}, writeDB, { new: true, upsert: true});
        })
        .then( () => {
            console.log(`Token updated in DB`);
        })
        .catch( (err) => {
            console.log(err);
        });
};

const lookupToken = () => {
    return tdauths.find({"token": "1"}, 'access_token token_created_date')
        .then( (queryResult) => {
            return queryResult[0];
        })
        .catch((err) => {
            console.log(err);
            return 'Not Found';
        });
};

const authToken = {
    access_token: null,
    token_created: null
};

const initializeTokens = () => {
    lookupToken().then((result) => {
        authToken.access_token = 'Bearer ' + result.access_token;
        authToken.token_created = result.token_created_date;
    })
};

/*
    Builds request structure for requesting a new token through first time authentication
        Currently login must be completed manually through the browser for the redirect
 */
const getToken = async (oAuthCode) => {
    options.data.grant_type = 'authorization_code';
    options.data.code = oAuthCode;
    await requestToken(options);
};

//    Builds request structure for requesting a new token using a refresh token
const refreshToken = () => {
    tdauths.find({"token": "1"}, 'refresh_token')
        .then( (queryResult) => {
            options.data.grant_type = 'refresh_token';
            options.data.refresh_token = queryResult[0].refresh_token;
            options.data.code = '';
            requestToken(options)
                .then(() => { console.log(`Token Refreshed`); })
                .catch( (err) => { console.log(err); })
        })
        .catch( (err) => {
            console.log(err);
        });
};

module.exports = {authToken, refreshToken, getToken, initializeTokens};

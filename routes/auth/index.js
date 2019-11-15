const axios = require ('axios');
const mongoose = require('mongoose');
const querystring = require('querystring');
const {authSchema} = require('../../model/authModel');
const config = require('../../config');

/**
 * connect to auth collection
 */
const tdauths = mongoose.model('tdauths', authSchema);

/**
 *  object for auth post request
 */
const options = {
    data: {
        'access_type': 'offline',
        'client_id': config.acct.client_id,
        'redirect_uri': config.acct.redirect_uri
    }
};

const authToken = {
    access_token: null,
    updatedAt: null
};

/**
 * Function for requesting a new or refreshed token
 * Stores the returned Access and Refresh tokens in mongo db
*/
const requestToken = async () => {
    let data = querystring.stringify(options.data);

    axios.post('https://api.tdameritrade.com/v1/oauth2/token',
        data, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        .then( async (oAuthReply) => {
            let currentTime = Date.now();

            authToken.updatedAt = currentTime;
            authToken.access_token = 'Bearer ' + oAuthReply.data.access_token;

            let writeDB = {
                "_id": '1',
                "access_token": oAuthReply.data.access_token,
                "refresh_token": oAuthReply.data.refresh_token,
                'updatedAt': currentTime
            };

            await tdauths.findOneAndUpdate({"_id":"1"}, writeDB, { new: true, upsert: true});
        })
        .then( () => console.log(`Token updated in DB`))
        .catch( (err) => console.log(err));
};

const lookupToken = () => {
    return tdauths.find({"_id": "1"}, 'access_token updatedAt')
        .then( (queryResult) => {
            return queryResult[0];
        })
        .catch((err) => {
            console.log(err);
            return 'Not Found';
        });
};

const initializeTokens = () => {
    lookupToken().then((result) => {
        authToken.access_token = 'Bearer ' + result.access_token;
        authToken.updatedAt = result.updatedAt;
    });
};

/**
 * Builds request structure for requesting a new token through first time authentication
 * Currently login must be completed manually through the browser for the redirect
 */
const getToken = async (oAuthCode) => {
    options.data.grant_type = 'authorization_code';
    options.data.code = oAuthCode;
    await requestToken();
};

/**
 * Builds request structure for requesting a new token using a refresh token
 */
const refreshToken = () => {
    tdauths.find({"_id": "1"}, 'refresh_token')
        .then( (queryResult) => {
            options.data.grant_type = 'refresh_token';
            options.data.refresh_token = queryResult[0].refresh_token;
            options.data.code = '';
            requestToken()
                .then( () =>  console.log(`Token Refreshed`) )
                .catch( (err) =>  console.log(err) )
        })
        .catch( (err) => console.log(err) );
};

/**
 * Validate that the access token is fresh within the last 10 minutes
 * @returns {boolean}
 */
const validateTokenIsFresh = () => {
    if (authToken.updatedAt === undefined || authToken.updatedAt === null) {
        return false;
    }

    let diff = ( Date.now() - authToken.updatedAt ) / 60000; // Get the difference in minutes

    return (diff<= 10)
};

module.exports = {authToken, refreshToken, getToken, initializeTokens, validateTokenIsFresh};

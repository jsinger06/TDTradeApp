const axios = require ('axios');
const querystring = require('querystring');
const debug = require('debug')('tradingapi:api:auth');
const config = require('../../../config');

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

/**
 *  Sets the required data for the JWT Token request
 * @param requestType - newToken or refreshToken
 * @param requestData - data to include in the request newToken=oAuthCode, refreshToken=refresh_token
 */
const setOptions = (requestType, requestData) => {
    if(requestType === 'newToken'){
        options.data.grant_type = 'authorization_code';
        options.data.code = requestData;
        options.data.refresh_token = ''
    } else if (requestType === 'refreshToken') {
        options.data.grant_type = 'refresh_token';
        options.data.refresh_token = requestData;
        options.data.code = '';
    }

};

/**
 * Function for requesting a new or refreshed token
 * Stores the returned Access and Refresh tokens in mongo db
 * @param requestType - Passed to setOptions
 * @param requestData - Passed to setOptions
 * @returns {Promise<Object>}
 */
const requestToken = (requestType, requestData) => {

    setOptions(requestType, requestData);

    let data = querystring.stringify(options.data);

    return new Promise((resolve, reject) => {
        return axios.post('https://api.tdameritrade.com/v1/oauth2/token',
            data, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
            .then((oAuthReply) => {
                    debug(oAuthReply.data);
                    resolve(oAuthReply.data);
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};


module.exports = {requestToken};

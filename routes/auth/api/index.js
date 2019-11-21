const axios = require ('axios');
const querystring = require('querystring');
const debug = require('debug')('tradingapi:api:auth');
const { devAcct } = require('../../../config');

/**
 *  object for auth post request
 */
const requestData = {
        'access_type': 'offline',
        'client_id': devAcct.client_id,
        'redirect_uri': devAcct.redirect_uri
};

/**
 *  Sets the required data for the JWT Token request
 * @param requestType - newToken or refreshToken
 * @param reqData - data to include in the request newToken=oAuthCode, refreshToken=refresh_token
 */
const setOptions = (requestType, reqData) => {
    if(requestType === 'newToken'){
        requestData.grant_type = 'authorization_code';
        requestData.code = reqData;
        requestData.refresh_token = ''
    } else if (requestType === 'refreshToken') {
        requestData.grant_type = 'refresh_token';
        requestData.refresh_token = reqData;
        requestData.code = '';
    }

};

/**
 * Function for requesting a new or refreshed token
 * Stores the returned Access and Refresh tokens in mongo db
 * @param requestType - Passed to setOptions
 * @param reqData - Passed to setOptions
 * @returns {Promise<Object>}
 */
const requestToken = (requestType, reqData) => {

    setOptions(requestType, reqData);

    return new Promise((resolve, reject) => {
        return axios.post(
            'https://api.tdameritrade.com/v1/oauth2/token',
            querystring.stringify(requestData),
            {
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

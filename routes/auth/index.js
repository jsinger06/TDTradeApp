const mongoose = require('mongoose');
const debug = require('debug')('tradingapi:routes:authToken');
const {authSchema} = require('../../model/authModel');
const authAPI = require('./api');

/**
 * connect to auth collection
 */
const tdauths = mongoose.model('tdauths', authSchema);

const authToken = {
    access_token: null,
    updatedAt: null
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
 * Cache the access_token for use and store the refresh_token and access_token in the db
 * @param resData - Object containing token data
 * @returns {Promise<void>}
 */
const cacheAndStoreToken = ( resData ) => {
    debug(`starting cacheAndStoreToken`);
    return new Promise((resolve, reject) => {
        const currentTime = Date.now();

        authToken.updatedAt = currentTime;
        authToken.access_token = 'Bearer ' + resData.access_token;

        const writeDB = {
            "_id": '1',
            "access_token": resData.access_token,
            "refresh_token": resData.refresh_token,
            'updatedAt': currentTime
        };

        tdauths.findOneAndUpdate({"_id": "1"}, writeDB, {new: true, upsert: true})
            .then(() => {
                debug(`token stored to DB`);
                resolve();
            } )
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

/**
 * Requests new token using oAuthCode provided to redirect url
 *      call cacheAndStoreToken to save token data
 */
const newAccessToken =  (oAuthCode) => {
    return new Promise((resolve, reject) => {
        authAPI.requestToken('newToken', oAuthCode)
            .then((result) => {
                debug(`storing token`);
                cacheAndStoreToken(result)
                    .then(() => resolve())
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            });
    });
};

/**
 * Requests new token using stored refresh token
 *      call cacheAndStoreToken to save token data
 * @returns {Promise<void>}
 */
const refreshToken = () => {
    debug(`start refreshToken`);
    return new Promise((resolve, reject) => {
        tdauths.find({"_id": "1"}, 'refresh_token')
            .then((queryResult) => {
                authAPI.requestToken('refreshToken', queryResult[0].refresh_token )
                    .then((result) => {
                        debug(`storing token`);
                        cacheAndStoreToken(result)
                            .then(() => resolve() );
                    })
                    .catch((err) => {
                        console.log(err);
                        reject(err);
                    });
            })
            .catch((err) => {
                console.log(err);
                reject(err);
            });
    });
};

/**
 * Return a fresh token
 * @returns {Promise<accessToken>}
 */
const getToken = () => {

    return new Promise((resolve, reject) => {
        module.exports.validateTokenIsFresh()
            .then((isTokenFresh) => {
                if (isTokenFresh) {
                    debug(`Access Token: ${authToken.access_token}`);
                    resolve(authToken.access_token);
                } else {
                    module.exports.refreshToken()
                        .then(() => {
                            debug(`finishing getToken - ${authToken.access_token}`);
                            resolve(authToken.access_token);
                        });
                }
            })
            .catch(() => {
                debug(`Token was invalid`);
                reject('Error getting token');
            });
    });
};

/**
 * Validate that the access token is fresh within the last 10 minutes
 * @returns {Promise<Boolean>}
 */
const validateTokenIsFresh = () => {
    return new Promise((resolve) => {
        if (authToken.updatedAt === undefined || authToken.updatedAt === null) {
            return resolve(false);
        }

        const diff = (Date.now() - authToken.updatedAt) / 60000; // Get the difference in minutes

        return diff <= 10 ? resolve(true) : resolve(false);
        
    });
};

module.exports = {authToken, getToken, refreshToken, newAccessToken, initializeTokens, validateTokenIsFresh};

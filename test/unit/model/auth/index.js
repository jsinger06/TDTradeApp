const chai = require('chai');
const should = chai.should();
const oAuthToken = require('../../../../routes/auth');

describe('Auth Module', function() {

    context('refresh Token', function() {

        it('should return false when token is older than 10 minutes', function() {
            oAuthToken.authToken.updatedAt = Date.parse('2019-11-10 14:03:55.985Z');

            oAuthToken.validateTokenIsFresh()
                .should.equal(false);
        });

        it('should return true when token is newer than 10 minutes', function() {
            let testDate = new Date();
            oAuthToken.authToken.updatedAt = testDate.setMinutes( testDate.getMinutes() - 9 );

            oAuthToken.validateTokenIsFresh()
                .should.equal(true);
        });

        it('should return false when token is null or undefined', function() {
            oAuthToken.authToken.updatedAt = null;

            oAuthToken.validateTokenIsFresh()
                .should.equal(false);
        });
    });
});
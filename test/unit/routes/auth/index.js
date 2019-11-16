const sinon = require('sinon');
const chai = require('chai');
const should = chai.should();
const sinonChai = require('sinon-chai');
let oAuthToken = require('../../../../routes/auth');
chai.use(sinonChai);

describe('Auth Module', function() {

    context('Validate Token is fresh', function() {

        it('should return false when token is older than 10 minutes', function(done) {
            oAuthToken.authToken.updatedAt = Date.parse('2019-11-10 14:03:55.985Z');

            oAuthToken.validateTokenIsFresh()
                .then( result => {
                    result.should.equal(false);
                    done();
                })
                .catch( err => done(err) );

        });

        it('should return true when token is newer than 10 minutes', function(done) {
            let testDate = new Date();
            oAuthToken.authToken.updatedAt = testDate.setMinutes( testDate.getMinutes() - 9 );

            oAuthToken.validateTokenIsFresh()
                .then( result => {
                    result.should.equal(true);
                    done();
                })
                .catch( err => done(err) );
        });

        it('should return false when token is null or undefined', function(done) {
            oAuthToken.authToken.updatedAt = null;

            oAuthToken.validateTokenIsFresh()
                .then( result => {
                    result.should.equal(false);
                    done();
                })
                .catch( err => done(err) );
        });
    });

    context('getToken', function() {
        let validateTokenStub;

        before(function() {
            validateTokenStub = sinon.stub(oAuthToken, 'validateTokenIsFresh').resolves(true);

            oAuthToken.authToken.access_token = 'Poop Token';
        });

        after(function() {
            validateTokenStub.restore();
        });

        it('should validate the token is fresh', function(done) {

            oAuthToken.getToken()
                .then( () => {
                    validateTokenStub.should.have.been.calledOnce;
                    done();
                })
                .catch( (err) => done(err) );
        });

        it('should return the token when fresh', function(done) {

            oAuthToken.getToken()
                .then(token => {
                    token.should.equal('Poop Token');
                    done();
                })
                .catch( err => done(err) );
        });

        it('should call refreshToken and return fresh token when token is invalid', function(done) {
            validateTokenStub.resolves(false);
            let refreshTokenStub = sinon.stub(oAuthToken, 'refreshToken');

            refreshTokenStub.callsFake(function fakefn() {
                oAuthToken.authToken.access_token = 'Refreshed Token';
            });

            oAuthToken.getToken()
                .then( token => {
                    refreshTokenStub.should.have.been.calledOnce;
                    token.should.equal('Refreshed Token');
                    done();
                })
                .catch( err => done(err) );
        });
    });
});
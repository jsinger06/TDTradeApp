const fs = require('fs');
const https = require('https');
const express = require('express');
const mongoose = require('mongoose');
const oAuthToken = require('./routes/auth');
const quotes = require('./routes/quotes');
const config = require('./config');

//Load SSL certificate and private key from files
const privateKey  = fs.readFileSync('./cert/key.pem', 'utf8');
const certificate = fs.readFileSync('./cert/certificate.pem', 'utf8');
const credentials = {key: privateKey, cert: certificate};

mongoose.Promise = global.Promise;
mongoose.connect(config.dev.mongodb)
    .then(() => {
      console.log('Connected to DB');
    })
    .catch((err) => {
      console.log(err);
    });


const app = express();

// Start a secure web server and listen on port 8443
const httpsServer = https.createServer(credentials, app);
console.log("Listening on port 8443...");
httpsServer.listen(8443);

// redirect uri
app.get('/auth/newtoken', function(req, res){
  console.log('New request');
  oAuthToken.getToken(req.query.code);
  res.end();
});

// Manually force token renewal
app.get('/auth/refresh', function(req, res){
  console.log('refresh request');
  oAuthToken.refreshToken();
  res.end();
});

//load access token on start up
oAuthToken.initializeTokens();

//testing quote request
setTimeout(() => {quotes.requestQuote('test')}, 3000);
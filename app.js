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

httpsServer.listen(config.PORT);
console.log("Listening on port 8443...");

//load access token on start up
oAuthToken.initializeTokens();

// redirect uri
app.get('/auth/newtoken', (req, res) => {
  console.log('New request');
  oAuthToken.getToken(req.query.code);
  res.end();
});

// Manually force token renewal
app.get('/auth/refresh', (req, res) => {
  console.log(`refresh request`);
  oAuthToken.refreshToken();
  res.end();
});

app.get('/quote/', (req, res) => {
    console.log(`Symbol List: ${req.query.symbolList}`);
    quotes.requestQuote(req.query.symbolList, res);
});


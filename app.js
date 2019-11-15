const express = require('express');
const oAuthToken = require('./routes/auth');
const quotes = require('./routes/quotes');

const app = express();

/*todo: figure out where to load oAuthToken
load access token on start up
oAuthToken.initializeTokens();*/

// redirect uri
app.get('/auth/newtoken', (req, res) => {
  console.log('New request');
  oAuthToken.getToken(req.query.code)
      .then(() => res.end())
      .catch(err => res.end(err))
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

module.exports = app;
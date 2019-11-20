const express = require('express');
const oAuthToken = require('./routes/auth');
const quotes = require('./routes/quotes');

const app = express();

// redirect uri
app.get('/auth/newtoken', (req, res) => {
  console.log('New request');
  oAuthToken.newAccessToken(req.query.code)
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
    oAuthToken.getToken()
        .then((token) => {
            quotes.requestQuote(token, req.query.symbolList)
                .then((quoteData) => {
                    res.json(quoteData);
                })
                .catch((err) => {
                    res.json(err);
            });
        });
});

module.exports = app;
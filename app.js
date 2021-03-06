const express = require('express');
const bodyParser = require('body-parser');
const oAuthToken = require('./routes/auth');
const quotes = require('./routes/quotes');
const account = require('./routes/account');
const orders = require('./routes/order');
const watchlist = require('./routes/watchlist');

const app = express();
app.use(express.json());
// account
app.get('/account', (req, res) => {
    console.log('Account lookup request');
    oAuthToken.getToken()
        .then((token) => {
            account.getAccount(token)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    res.json(err);
            });
        });
  });

// new token redirect uri
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

// request quote
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

// request orders
app.get('/orders/', (req, res) => {
    console.log(`Orders request`);
    oAuthToken.getToken()
        .then((token) => {
            orders.getOrders(token)
                .then((quoteData) => {
                    res.json(quoteData);
                })
                .catch((err) => {
                    res.json(err);
                });
        });
});

// request watchlist
app.get('/watchlist/', (req, res) => {
    console.log(`get watchlist request`);
    oAuthToken.getToken()
        .then((token) => {
            watchlist.getWatchlist(token)
                .then((watchlistData) => {
                    res.json(watchlistData);
                })
                .catch((err) => {
                    res.json(err);
                });
        });
});

// create watchlist
app.post('/watchlist/', (req, res) => {
    console.log(`get watchlist request`);
    oAuthToken.getToken()
        .then((token) => {
            watchlist.createWatchlist(token, req.body.watchlistName)
                .then((watchlistData) => {
                    res.json(watchlistData);
                })
                .catch((err) => {
                    res.json(err);
                });
        });
});

module.exports = app;
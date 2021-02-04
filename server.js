require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./database');
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

app.post('/api/shorturl/new', (req, res) => {
  let originalUrl = req.body.url;
  validateUrl(originalUrl, (addresses) => {
    if (addresses) {
      const urlAlias = database.saveToDatabase(originalUrl, (err) => {
        res.send(err);
      });
      res.json({original_url: originalUrl, short_url: urlAlias});
    } else {
      res.json({ error: 'invalid url' });
    }
  });
});

app.get('/api/shortcut/:alias', (req, res) => {
  const url = database.getUrlFromDatabase(req.params.alias, (err, url) => {
    if (err) {
      res.send(err);
      next();
    }
    res.redirect(url);
  });
});

function validateUrl(url, invalid) {
  dns.lookup(url, {all: true}, (err, addresses) => {
    invalid(addresses);
  });
}

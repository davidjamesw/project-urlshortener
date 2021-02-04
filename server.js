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
  validateUrl(originalUrl.host, (error) => {
    if (!error) {
      let href = originalUrl.href;
      database.saveToDatabase(href, (urlAlias) => {
        res.json({original_url: href, short_url: urlAlias});
      });
    } else {
      console.log(`Invalid URL: ${originalUrl}`)
      res.json({ error: 'invalid url' });
    }
  });
});

app.get('/api/shortcut/:alias', (req, res) => {
  const url = database.getUrlFromDatabase(req.params.alias, (url) => {
    res.redirect(url);
  });
});

function validateUrl(url, response) {
  try {
    new URL(url);
    response(null);
  } catch (err) {
    response(err);
  }
}

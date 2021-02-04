require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./database');
const bodyParser = require('body-parser');
const validUrl = require('valid-url');

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
  if (!validUrl.isUri(originalUrl)) {
    res.json({ error: 'invalid url' });
  } else {
    const urlAlias = database.saveToDatabase(originalUrl, (err) => {
      res.send(err);
    });
    res.json({original_url: originalUrl, short_url: urlAlias});
  }
});

app.get('/api/shortcut/:alias', (req, res) => {
  const url = database.getUrlFromDatabase(req.params.alias, (err, url) => {
    if (err) {
      res.send(err);
    }
    res.redirect(url);
  });
});

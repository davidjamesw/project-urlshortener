require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const database = require('./database');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(express.json());

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
  console.log(req.body);
  const urlAlias = database.saveToDatabase("test");
  res.json({original_url: "test", short_url: urlAlias});
});

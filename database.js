const mongoose = require('mongoose');
const mongodb = require('mongodb');
const crypto = require('crypto');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  url: {type: String, required: true},
  alias: {type: String, required: true}
})

const Url = mongoose.model("Url", urlSchema);

function saveToDatabase(url, response) {
  let urlAlias = crypto.randomBytes(4).toString('hex');
  let mappedUrl = new Url({"url": url, "alias": urlAlias});
  console.log(`Writing ${url} to the database, with an alias of ${urlAlias}`);
  mappedUrl.save((err, data) => {
    response(err, urlAlias);
  });
}

function getUrlFromDatabase(urlAlias, sendResponse) {
  console.log(`Retrieving URL from database using ${urlAlias}`);
  Url.find({alias: urlAlias}, (err, urls) => {
    if (err) {
      sendResponse(err, null);
    }
    if (urls.length > 0) {
      url = urls[0].url;
      sendResponse(null, url);
    }
  });
}

exports.saveToDatabase = saveToDatabase;
exports.getUrlFromDatabase = getUrlFromDatabase;
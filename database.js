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

function saveToDatabase(url) {
  let urlAlias = crypto.randomBytes(4).toString('hex');
  let mappedUrl = new Url({"url": url, "alias": urlAlias});
  console.log(`Writing ${url} to the database, with an alias of ${urlAlias}`);
    mappedUrl.save(function(err, data) {
      if (err) {
        return console.error(err);
      }
    });
  return urlAlias;
}

function getUrlFromDatabase(urlAlias) {
  console.log(`Retrieving URL from databse using ${urlAlias}`);
}

exports.saveToDatabase = saveToDatabase;
exports.getUrlFromDatabase = getUrlFromDatabase;
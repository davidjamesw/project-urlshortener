const mongoose = require('mongoose');
const mongodb = require('mongodb');
const crypto = require('crypto');

function saveToDatabase(url) {
  const urlAlias = crypto.createHash('md5').update(url).digest('hex');
  console.log(`Writing ${url} and ${urlAlias} to the database`);
  return urlAlias;
}

function getUrlFromDatabase(urlAlias) {
  console.log(`Retrieving URL from databse using ${urlAlias}`);
}

exports.saveToDatabase = saveToDatabase;
exports.getUrlFromDatabase = getUrlFromDatabase;
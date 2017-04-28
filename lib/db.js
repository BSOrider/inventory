var url = 'mongodb://localhost:27017/inventory';
var MongoClient = require('mongodb').MongoClient;
var db = null;

module.exports = function(cb) {
  if (db) {
    cb(db);
    return;
  }

  MongoClient.connect(url, function(err, conn) {
    if (err) {
      console.log(err.message);
      throw new Error(err);
    } else {
      console.log("Connected to Mongodb");
      db = conn;
      cb(db);
    }
  });
};

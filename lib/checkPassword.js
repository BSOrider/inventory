module.exports = function(input) {
  var mongodb = require('mongodb');
  var mongoClient = mongodb.MongoClient;
  var mongoUrl = "mongodb://localhost:27017/inventory";
  mongoClient.connect(mongoUrl, function(error, db) {
    if (error) {
      console.log(error);
    } else {
      var collection = db.collection('validation');
      collection.find({}).toArray(function(error, docs) {
        var password = docs[0].password;
        db.close();
        if (error) {
          console.log(error);
        } else if (input == password) {
          console.log("validated!");
          return true;
        } else {
          console.log("rejected!");
          return false;
        }
      });
    }
  });
};

var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();

/* home page */
router.get('/', function(req, res) {
  console.log("sending index...");
  // DB call
  var mongoClient = mongodb.MongoClient;
  var mongoUrl = "mongodb://localhost:27017/inventory";

  mongoClient.connect(mongoUrl, function(error, db) {
    if (error) {
      console.log(error);
    } else {
      var collection = db.collection('saddles');
      collection.find({}).toArray(function(error, saddles) {
        if (error) {
          console.log(error);
        } else if (saddles.length) {
          res.render('index', {
            "index": saddles
          });
        } else {
          res.send("No saddles available! (actually just a database error)");
        }
        db.close();
      });
    }
  });
  // render page
  // res.render('index', { title: 'SADDLES!!', dbInfo: [{ type: "blab" }, { type: "bluh" }] });
});

/* new saddle page */
router.get('/newSaddle', function(req, res) {
  res.render('new_saddle', { title: 'SADDLES!!', dbInfo: [{ type: "blab" }, { type: "bluh" }] });
});

/* save saddle data */
router.post('/saveSaddle', function(req, res) {
  var mongoClient = mongodb.MongoClient;
  var mongoUrl = "mongodb://localhost:27017/inventory";
  mongoClient.connect(mongoUrl, function(error, db) {
    if (error) {
      console.log(error);
    } else {
      var newSaddle = {
        name: req.body.name,
        price: req.body.price,
        width: req.body.width
      };
      var password = req.body.password;
      var collection = db.collection('saddles');
      collection.insert([newSaddle], function(err, result) {
        if (err) {
          console.log(err);
        } else {
          // res.redirect("/");
          res.send("Success!");
        }
        db.close();
      });
    }
  });
});

/* save saddle image */
router.post('/savePic', function(req, res) {
  // create an incoming form object
  var form = new formidable.IncomingForm();
  // specify that we want to allow the user to upload multiple files in a single request
  form.multiples = true;
  // store all uploads in the /uploads directory
  form.uploadDir = path.join(__dirname, '../public/images');
  // every time a file has been uploaded successfully,
  // rename it to it's orignal name and delete original photo
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  // log any errors that occur
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  // once all the files have been uploaded, send a response to the client
  form.on('end', function() {
    res.end('success');
  });
  // parse the incoming request containing the form data
  form.parse(req);
});

module.exports = router;

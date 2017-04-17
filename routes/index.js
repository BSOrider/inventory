var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var express = require('express');
var mongodb = require('mongodb');
var router = express.Router();
var checkPwd = require('../lib/checkPassword.js');

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
  res.render('new_saddle', { title: 'New saddle'});
});

/* save saddle data */
router.post('/saveSaddle', function(req, res) {
  console.log("SADDLE DATA BEING SAVED!");
  var mongoClient = mongodb.MongoClient;
  var mongoUrl = "mongodb://localhost:27017/inventory";
  mongoClient.connect(mongoUrl, function(error, db) {
    if (error) {
      console.log(error);
    } else {
      console.log("should be form data here:");
      console.log(req.body);
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
  // console.log("SADDLE PIC BEING SAVED!");
  // console.log(req);
  // console.log("The password is:");
  // console.log(req.password);
  var form = new formidable.IncomingForm();
  form.multiples = true;
  form.uploadDir = path.join(__dirname, '../public/images');
  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadDir, file.name));
  });
  form.on('error', function(err) {
    console.log('An error has occured: \n' + err);
  });
  form.on('end', function() {
    res.end('success');
  });
  form.parse(req);
});

module.exports = router;

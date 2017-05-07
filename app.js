var express = require('express');
var formidable = require('formidable');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var mongodb = require("mongodb");
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var connection = require('./lib/db.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* =================================================== */
/* =================================================== */
/* ================ 'PUBLIC' PAGES =================== */
/* =================================================== */
/* =================================================== */

/* home page */
app.get('/', function(req, res) {
  console.log(new Date());
  res.render('index', {
    "pageType": "homepage",
    "title": "Sillinazo"
  });
});

/* about page */
app.get('/about', function(req, res) {
  console.log(new Date());
  res.render('about', {
    "pageType": "no-sidebar",
    "title": "Acerca de Sillinazo"
  });
});

/* saddles page */
app.get('/saddles', function(req, res) {
  console.log(new Date());
  connection(function(db) {
    var collection = db.collection('saddles');
    collection.find({}).toArray(function(error, saddles) {
      if (error) {
        console.log(error);
      } else {
        res.render('saddles', {
          "pageType": "no-sidebar",
          "title": "Sillines",
          "saddles": saddles
        });
      }
    });
  });
});

/* =================================================== */
/* =================================================== */
/* ================ 'PRIVATE' PAGES ================== */
/* =================================================== */
/* =================================================== */

/* admin page */
app.get('/admin', function(req, res) {
  console.log(new Date());
  connection(function(db) {
    var collection = db.collection('saddles');
    collection.find({}).toArray(function(error, saddles) {
      if (error) {
        console.log(error);
      } else {
        res.render('admin', { title: 'Admin', saddles: saddles });
      }
    });
  });
});

/* delete saddle */
app.post('/deleteSaddle', function(req, res) {
  console.log(new Date());
  var itemToDelete = req.query.id;
  var token = req.query.token;
  var image = req.query.image;
  connection(function(db) {
    var collection = db.collection('validation');
    collection.find({}).toArray(function(error, docs) {
      var password = docs[0].password;
      if (error) {
        console.log(error);
      } else if (token == password) {
        connection(function(db) {
          var collection = db.collection('saddles');
          collection.deleteOne({ _id: new mongodb.ObjectID(itemToDelete) });
          fs.unlink('./public/saddlePics/' + image, function(err) {
            if (err) {
              console.log(err);
            } else {
              res.end('success');
            }
          });
        });
      } else {
        console.log("rejected!");
        // once recieved causes redirecion to 'stuffed' page
        res.sendStatus(500);
      }
    });
  });
});

/* save saddle image */
app.post('/saveSaddle', function(req, res) {
  console.log(new Date());
  var token = req.query.token;
  var newSaddle = {
    name: req.query.name,
    price: req.query.price,
    width: req.query.width,
    padding: req.query.padding
  };
  connection(function(db) {
    var collection = db.collection('validation');
    collection.find({}).toArray(function(error, docs) {
      var password = docs[0].password;
      if (error) {
        console.log(error);
      } else if (token == password) {
        console.log("validated!");
        // prep image name holder
        var imgName = null;
        var form = new formidable.IncomingForm();
        form.multiples = true;
        form.uploadDir = path.join(__dirname, './public/saddlePics');
        form.on('file', function(field, file) {
          // get image name to be saved along with rest of data
          imgName = file.name;
          // rename to correct name
          fs.rename(file.path, path.join(form.uploadDir, file.name));
        });
        form.on('error', function(err) {
          console.log('An error has occured: \n' + err);
        });
        form.on('end', function() {
          // add pic name to saddle data
          newSaddle.image = imgName;
          // save data
          var collection = db.collection('saddles');
          // save saddle data in collection
          collection.insert([newSaddle], function(err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("new saddle saved!");
              res.end('success');
            }
          });
        });
        form.parse(req);
      } else {
        console.log("rejected!");
        // once recieved causes redirecion to 'stuffed' page
        res.sendStatus(500);
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log("should be 404");
  console.log(new Date());
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

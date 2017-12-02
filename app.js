const express = require('express');
const formidable = require('formidable');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const fs = require('fs');
const mongodb = require("mongodb");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./lib/db.js');
const multer = require('multer');
const upload = multer({ dest: 'public/saddlePics' });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

/* =================================================== */
/* =================================================== */
/* ================ 'PUBLIC' PAGES =================== */
/* =================================================== */
/* =================================================== */

/* home page */
app.get('/', function (req, res) {
  console.log(new Date());
  res.render('index', {
    "pageType": "homepage",
    "title": "Sillinazo"
  });
});

/* about page */
app.get('/about', function (req, res) {
  console.log(new Date());
  res.render('about', {
    "pageType": "no-sidebar",
    "title": "Acerca de Sillinazo"
  });
});

/* analysis page */
app.get('/analysis', function (req, res) {
  console.log(new Date());
  res.render('analysis', {
    "pageType": "no-sidebar",
    "title": "Acerca de Sillinazo"
  });
});

/* saddles page */
app.get('/saddles', function (req, res) {
  console.log(new Date());
  connection(function (db) {
    var collection = db.collection('saddles');
    collection.find({}).toArray(function (error, saddles) {
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
app.get('/admin', function (req, res) {
  console.log(new Date());
  connection(function (db) {
    var collection = db.collection('saddles');
    collection.find({}).toArray(function (error, saddles) {
      if (error) {
        console.log(error);
      } else {
        res.render('admin', { title: 'Manage saddles', saddles: saddles });
      }
    });
  });
});

/* delete saddle */
app.post('/deleteSaddle', function (req, res) {
  console.log(new Date());
  var itemToDelete = req.query.id;
  var token = req.query.token;
  var image = req.query.image;
  connection(function (db) {
    var collection = db.collection('validation');
    collection.find({}).toArray(function (error, docs) {
      var password = docs[0].password;
      if (error) {
        console.log(error);
      } else if (token == password) {
        connection(function (db) {
          var collection = db.collection('saddles');
          collection.deleteOne({ _id: new mongodb.ObjectID(itemToDelete) });
          fs.unlink('./public/saddlePics/' + image, function (err) {
            if (err) {
              console.log(err);
              res.end('success');
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
app.post('/saveSaddle', upload.single('file'), function (req, res) {
  console.log(new Date());
  var token = req.body.password;
  var newSaddle = {
    name: req.body.name,
    price: req.body.price,
    width: req.body.width,
    padding: req.body.padding,
    condition: req.body.condition
  };
  connection(function (db) {
    var collection = db.collection('validation');
    collection.find({}).toArray(function (error, docs) {
      var password = docs[0].password;
      if (token == password) {
        console.log("validated!");
        let imageName = req.file.originalname;
        console.log(imageName);
        // rename to correct name
        fs.rename(req.file.path, path.join(req.file.destination, req.file.originalname), function (err, result) {
          console.log(result);
          // add pic name to saddle data
          newSaddle.image = imageName;
          // save data
          var collection = db.collection('saddles');
          // save saddle data in collection
          collection.insert([newSaddle], function (err, result) {
            if (err) {
              console.log(err);
            } else {
              console.log("new saddle saved!");
              return res.redirect('admin');
            }
          });
        });
      } else {
        console.log("rejected!");
        // once recieved causes redirecion to 'stuffed' page
        // return res.redirect(500);
      }
    });
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log("should be 404");
  console.log(new Date());
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

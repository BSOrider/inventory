var express = require('express');
var formidable = require('formidable');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://localhost:27017/inventory";
var fs = require('fs');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var checkPwd = require('./lib/checkPassword.js');
var db = require('./lib/db.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// var index = require('./routes/index');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use('/', index);

/* home page */
app.get('/', function(req, res) {
  console.log("sending index...");
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
});

/* new saddle page */
app.get('/newSaddle', function(req, res) {
  res.render('new_saddle', { title: 'New saddle' });
});

/* for hackers */
app.get('/fu', function(req, res) {
  res.render('fu', {});
});

/* save saddle data */
app.post('/saveSaddle', function(req, res) {
  console.log("SADDLE DATA BEING SAVED!");
  mongoClient.connect(mongoUrl, function(error, db) {
    if (error) {
      console.log(error);
    } else {
      var collection = db.collection('validation');
      collection.find({}).toArray(function(error, docs) {
      	var input = req.body.password;
      	console.log(input);
        var password = docs[0].password;
        // db.close();
        if (error) {
          console.log(error);
        } else if (input == password) {
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
              res.send("Success!");
            }
            db.close();
          });
        } else {
          console.log("rejected!");
          res.redirect("/fu");
        }
      });
    }
  });
  // mongoClient.connect(mongoUrl, function(error, db) {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log("should be form data here:");
  //     console.log(req.body);
  //     var newSaddle = {
  //       name: req.body.name,
  //       price: req.body.price,
  //       width: req.body.width
  //     };
  //     var password = req.body.password;
  //     var collection = db.collection('saddles');
  //     collection.insert([newSaddle], function(err, result) {
  //       if (err) {
  //         console.log(err);
  //       } else {
  //         res.send("Success!");
  //       }
  //       db.close();
  //     });
  //   }
  // });
});

/* save saddle image */
app.post('/savePic', function(req, res) {
  var name = req.query.name;
  var width = req.query.width;
  var price = req.query.price;
  var token = req.query.token;
  // mongoClient.connect(mongoUrl, function(error, db) {
  //   if (error) {
  //     console.log(error);
  //   } else {
    // console.log(db);
      var collection = db.collection('validation');
      collection.find({}).toArray(function(error, docs) {
        var password = docs[0].password;
        db.close();
        if (error) {
          console.log(error);
        } else if (token == password) {
          console.log("validated!");
          // save image
          var form = new formidable.IncomingForm();
          form.multiples = true;
          form.uploadDir = path.join(__dirname, './public/images');
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
        } else {
          console.log("rejected!");
          res.redirect("/fu");
          // res.err("invalid token");
        }
      });
  //   }
  // });
});

// console.log("should be form data here:");
//           console.log(req.body);
//           var newSaddle = {
//             name: req.body.name,
//             price: req.body.price,
//             width: req.body.width
//           };
//           var password = req.body.password;
//           var collection = db.collection('saddles');
//           collection.insert([newSaddle], function(err, result) {
//             if (err) {
//               console.log(err);
//             } else {
//               res.send("Success!");
//             }
//             db.close();
//           });

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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

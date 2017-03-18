var formidable = require('formidable');
var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();

/* home page */
router.get('/', function(req, res, next) {
  console.log("sending index...")
  res.render('index', { title: 'Express', dbInfo: [{type: "blab"}, {type: "bluh"}] });
});

/* new saddle page */
router.get('/po0ooRaJ2aih0rai4ahs', function(req, res, next) {
  console.log("sending new saddle...")
  res.render('new_saddle', { title: 'Express', dbInfo: [{type: "blab"}, {type: "bluh"}] });
});

/* upload image */
router.post('/upload', function(req, res){
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
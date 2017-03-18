var express = require('express');
var router = express.Router();

/* GET new product page. */
router.get('/new_saddle', function(req, res, next) {
  console.log("sending new saddle...");
  res.render('new_saddle', { title: 'New Saddle'});
});

module.exports = router;
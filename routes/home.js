var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  nickname: String,
  tweet: String,
  date: String,
  diese: String
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'Express' });
});

router.post('/', function(req, res) {
  console.log('tweet ' + req.body.Tweet);
});

module.exports = router;

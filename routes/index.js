var express = require('express');
var mongoose = require('mongoose');
var crypto = require('crypto');

var router = express.Router();

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  nickname: String,
  mail: String,
  password: String
});

var userModel = mongoose.model('User', userSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', function(req, res) {
  console.log('name ' + req.body.Nickname);
  console.log('name ' + req.body.Mail);
  console.log('name ' + req.body.Password);
  var hash = crypto.createHash("sha512").update(req.body.Password).digest("base64");

  var newuser = new userModel({ nickname : req.body.Nickname, mail : req.body.Mail, password : hash});
  newuser.save();
});

module.exports = router;

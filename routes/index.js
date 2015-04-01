var express = require('express');
var mongoose = require('mongoose');

var router = express.Router();

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
  console.log('Mail ' + req.body.Mail);
  console.log('Password ' + req.body.Password);
  var newuser = new userModel({ nickname : req.body.Nickname, mail : req.body.Mail, password : req.body.Password});
  newuser.save();
});

module.exports = router;

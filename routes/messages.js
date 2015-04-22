var express = require('express');
var moment = require('moment');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
	res.redirect('/');
}

module.exports = function(passport){

  // message
	
	router.get('/message', isAuthenticated, function(req, res){
		res.render('message', {user: req.user});
	});

  return router;
}

var express = require('express');
var moment = require('moment');
var formidable = require('formidable');
var request = require('request');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

module.exports = function(passport){

  // message
	router.get('/message', isAuthenticated, function(req, res){
		res.render('message', {user: req.user});
	});

  return router;
}

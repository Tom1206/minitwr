var express = require('express');
var moment = require('moment');
var formidable = require('formidable');
var request = require('request');
var authenticate = require('../passport/authenticate.js');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

module.exports = function(passport){

  /* search tool */
	router.post('/search', authenticate.auth, function(req, res) {
		tweet.find({tweet: new RegExp(req.body.research, 'i')}).sort({date: -1}).exec(function(err,tweets) {
			User.find({username: new RegExp(req.body.research, 'i')}, function(err,users) {
				tweet.find({location: new RegExp(req.body.research, 'i')}).sort({date: -1}).exec(function(err,loc) {
					res.render('search', {user: req.user, tweet: tweets, users: users, loc: loc, search: req.body.research});
				});
			});
		});
	});

	router.get('/search/:tag', authenticate.auth, function(req, res){
				tweet.find({tweet: new RegExp(req.params.tag, 'i')}).exec(function (err, tweets) {
					if (err) return res.render('error', {message: err.message,error: err});
					else {
						res.render('search', {user: req.user, tweets: tweets});
					}
				});
			});

  return router;
}

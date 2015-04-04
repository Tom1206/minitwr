var express = require('express');
var moment = require('moment');
var router = express.Router();

var tweet = require('../models/tweet');

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

	/* / */
	router.get('/', function(req, res) {
		res.render('index', { message: req.flash('message') });
	});

	/* /login */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* /signup */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true
	}));

	/* /home */

	router.get('/home', isAuthenticated, function(req, res){
				tweet.find().limit(3).select("nickname date tweet -_id").sort({date: -1}).exec( function (err, tweets) {
			  if (err) return console.error(err);
				var test1=tweets[0];
				var test2=tweets[1];
				res.render('home', { user: req.user, tweet1: test1, tweet2: test2  });
				})
	});

  router.post('/home', isAuthenticated, function(req, res) {
		var date = moment().format('DD/MM/YYYY, HH:mm:ss');
		var newtweet = new tweet({nickname: req.user.username, tweet: req.body.Tweet, date: date});
		newtweet.save();
		res.redirect('/home');
  });

	/* logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}

var express = require('express');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
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

/* search tool */

	router.post('/search', isAuthenticated, function(req, res) {
		tweet.find({tweet: new RegExp(req.body.research, 'i')}).sort({date: -1}).exec(function(err,tweets) {
			User.find({username: new RegExp(req.body.research, 'i')}, function(err,users) {
				res.render('search', {user: req.user, tweets: tweets, users: users});
			});
		});
	});

	/* logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	return router;
}

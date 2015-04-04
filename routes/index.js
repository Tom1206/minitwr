var express = require('express');
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
			tweet.find(function (err, tweets) {
		  if (err) return console.error(err);
			res.render('home', { user: req.user, tweets: tweets });
		})
	});

  router.post('/home', isAuthenticated, function(req, res) {
		var todo = new tweet({tweet: req.body.Tweet});
		todo.save;
    console.log('tweet ' + todo);
  });

	/* logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}

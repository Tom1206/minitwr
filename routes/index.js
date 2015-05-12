var express = require('express');
var authenticate = require('../passport/authenticate.js');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

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


	/* logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});


	return router;
}

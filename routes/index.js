var express = require('express');
var moment = require('moment');
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
				tweet.find().limit(10).sort({date: -1}).exec( function (err, tweets) {
			  if (err) return console.error(err);
				res.render('home', { user: req.user, tweet: tweets});
			});
	});

	router.post('/affichetweet', isAuthenticated, function(req, res){
				tweet.find().limit(req.body.nbtweet).sort({date: -1}).exec( function (err, tweets) {
			  if (err) return console.error(err);
				res.render('home', { user: req.user, tweet: tweets});
			});
	});

	router.post('/deletetweet', isAuthenticated, function(req, res) {
		console.log('id: ' + req.body.idtweet);
		tweet.findByIdAndRemove(req.body.idtweet, function (err, tweet) {
		if (err) return console.error(err);
		res.redirect('/home');
	});
});

  router.post('/home', isAuthenticated, function(req, res) {
		var date = moment().format('DD/MM/YYYY, HH:mm:ss');
		var newtweet = new tweet({nickname: req.user.username, tweet: req.body.Tweet, date: date});
		newtweet.save();
		res.redirect('/home');
  });

	/* /Profile */

	router.get('/profile', isAuthenticated, function(req, res){
				res.render('profile', { user: req.user});
			});

	router.post('/profile', isAuthenticated, function(req, res){
				console.log('sexe ' + req.body.sexe);
				User.update({username: req.user.username}, {$set: { username: req.body.Nickname, email: req.body.Mail, pays: req.body.pays, description: req.body.tellus, sexe: req.body.sexe }}, { upsert: true }, function(){});
				res.redirect('profile');
	});

	router.get('/publicprofile', isAuthenticated, function(req, res){
				res.render('publicprofile', { user: req.user});
			});

	/* logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}

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

  /* /profile */

	router.get('/profile', isAuthenticated, function(req, res){
				res.render('profile', { user: req.user, name_picture: req.user.picture});
			});

	router.post('/profile', isAuthenticated, function(req, res){
				User.update({_id: req.user._id}, {$set: { username: req.body.Nickname, email: req.body.Mail, pays: req.body.pays, description: req.body.tellus, sexe: req.body.sexe }}, { upsert: true }, function(){});
				res.redirect('profile');
	});

	router.get('/publicprofile', isAuthenticated, function(req, res){
				tweet.find({id: req.user._id}).limit(10).sort({date: -1}).exec(function (err, tweets) {
						if (err) return console.error(err);
						res.render('publicprofile', { user: req.user, tweet: tweets});
				});
			});

	router.post('/publicprofile', isAuthenticated, function(req, res){
				tweet.find({id: req.user._id}).limit(req.body.nbtweet).sort({date: -1}).exec( function (err, tweets) {
				  if (err) return console.error(err);
					res.render('publicprofile', { user: req.user, tweet: tweets});
				});
			});

  /* upload profile picture */

  router.post('/upload', isAuthenticated, function(req, res) {
  	var form = new formidable.IncomingForm();
  	form.uploadDir = "./public/uploads/pictures";

  	form.parse(req, function (err, fields, files) {
            var name_picture_up = files.upload.path.substring(24);
  					User.update({username: req.user.username}, {$set: { picture: name_picture_up}}, { upsert: true }, function(){});
        });
  	res.redirect('/home');
  	});


  return router;
}

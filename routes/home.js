var express = require('express');
var moment = require('moment');
var request = require('request');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

var gmKey = '';

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

  /* GET /home */
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

	/* POST /home - send a tweet */
  router.post('/home', isAuthenticated, function(req, res) {
		// Add the tweet to the database
		var date = moment().format('DD/MM/YYYY, HH:mm');
		var newtweet = new tweet({nickname: req.user.username, tweet: req.body.Tweet, date: date, id: req.user._id});
		newtweet.save();

		// Add the location to the tweet if necessary
		function getLocation(callback){
			var apiCall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.body.latitude + ',' + req.body.longitude +'&key=' + gmKey;

			request({url: apiCall,json: true}, function (error, response, body) {
				if(!error && response.statusCode == 200) {
					var location = " - Envoyé depuis " + body.results[1].formatted_address;
					tweet.update({tweet: req.body.Tweet}, {location: location}).exec();
					callback(location);
				}
			});
		}

		function addLocation(result){
			res.redirect('/home');
		}

		if(req.body.latitude&&req.body.longitude){
			getLocation(function(result){
				addLocation(result);
			});
		}
		else{
			res.redirect('/home');
		}


  });

  return router;
}

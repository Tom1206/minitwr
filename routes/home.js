var express = require('express');
var moment = require('moment');
var request = require('request');
var authenticate = require('../passport/authenticate.js');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

// Google API key
var gmKey = '';

module.exports = function(passport){

  /* GET /home */
	router.get('/home', authenticate.auth, function(req, res){
				tweet.find().limit(10).sort({date: -1}).exec( function (err, tweets) {
			  if (err) return console.error(err);
				res.render('home', { user: req.user, tweet: tweets});
			});
	});

	router.post('/affichetweet', authenticate.auth, function(req, res){
				tweet.find().limit(req.body.nbtweet).sort({date: -1}).exec( function (err, tweets) {
			  if (err) return console.error(err);
				res.render('home', { user: req.user, tweet: tweets});
			});
	});

  // Check if the user can delete the tweet and delete it if OK
	router.post('/deletetweet', authenticate.auth, function(req, res) {
		tweet.findById(req.body.idtweet, function (err, tweets) {
			if(tweets.id == req.user._id){
				tweet.findByIdAndRemove(req.body.idtweet, function (err, supp) {

					if (err) return console.error(err);
					tweet.find().limit(10).sort({date: -1}).exec( function (err, tweet) {

					  if (err) return console.error(err);
						res.render('home', { user: req.user, tweet: tweet, suppression: 1});
					});
		  	});
			}
			else res.render('404');
  	});
	});

	/* POST /home - send a tweet */
  router.post('/home', authenticate.auth, function(req, res) {
		// Add the tweet to the database
		var date = moment().format('YYYY/MM/DD, HH:mm');
		var newtweet = new tweet({nickname: req.user.username, tweet: req.body.Tweet, date: date, id: req.user._id});
		newtweet.save();

		// Add the location to the tweet if necessary
		function getLocation(callback){
			var apiCall = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + req.body.latitude + ',' + req.body.longitude +'&key=' + gmKey;

			// Google API request
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

		// Check if latitude and longitude are correct
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

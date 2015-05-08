var express = require('express');
var formidable = require('formidable');
var fs = require('fs');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	if (req.isAuthenticated())
		return next();
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

	/* public profile */

	router.get('/public/:rId', isAuthenticated, function(req, res){
				User.find({_id: req.params.rId}).exec(function (err, rUser) {
					if (err) return res.render('error', {message: err.message,error: err});
					else {
							tweet.find({id: rUser[0]._id}).limit(10).sort({date: -1}).exec(function (err, tweets) {
							res.render('publicprofile', {user: req.user, rUser: rUser[0], tweet: tweets});
							});
					}
				});
			});

	/* delete tweet */
	router.post('/deletetweetp', isAuthenticated, function(req, res) {
		tweet.findById(req.body.idtweet, function (err, tweets) {
			if(tweets.id == req.user._id){
				tweet.findByIdAndRemove(req.body.idtweet, function (err, tweet) {
				if (err) return console.error(err);
				res.redirect('/public/'+req.user._id);
		  	});
			}
			else res.render('404');
  	});
	});
	/* delete account */

	router.post('/deleteaccount', isAuthenticated, function(req, res) {
		tweet.remove({id: req.user._id},function (err, tweets) {
			User.findByIdAndRemove(req.user._id, function (err, account) {
				if (err) return console.error(err);
				res.redirect('/');
			});
		});
	});

  /* profile picture upload */

  router.post('/upload', isAuthenticated, function(req, res) {
  	var form = new formidable.IncomingForm();
  	form.uploadDir = "./public/uploads/pictures";

		// delete the old picture
		if(req.user.picture != "default")
		{
			fs.unlink("public/uploads/pictures/" + req.user.picture, function(err) {
				if(err) console.log(err);
			})
		}

  	form.parse(req, function (err, fields, files) {
            var name_picture_up = files.upload.path.substring(24);
  					User.update({username: req.user.username}, {$set: { picture: name_picture_up}}, { upsert: true }, function(){});
        });
  	res.redirect('/home');
  	});


  return router;
}

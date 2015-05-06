var express = require('express');
var moment = require('moment');
var request = require('request');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');
var msg = require('../models/msg');



var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');


	var isAuthenticated = function (req, res, next) {
		if (req.isAuthenticated())
			return next();
		res.redirect('/');
	}

	module.exports = function(passport){

	  // message

		router.get('/message', isAuthenticated, function(req, res){
			res.render('message', {user: req.user});
		});

		var io = require('socket.io').listen(server);

		// Quand on client se connecte, on le note dans la console
    io.sockets.on('connection', function (socket) {

      socket.on('message', function (mess) {
          console.log('message : ' + mess);
      });

      socket.on('write', function(who){
        console.log('to : '+ who);
        console.log('from ' + user);
  //      var newmsg = new msg({id1: req.user.username, id2: who});
  //  		newtweet.save();
      });
    });

		server.listen(8080);
		return router;
	}

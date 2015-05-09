var express = require('express');
var moment = require('moment');
var request = require('request');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');
var msg = require('../models/msg');



var server = require('http').createServer(router),
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

		// Quand on client se connecte
    io.sockets.on('connection', function (socket, pseudo) {


      socket.on('message', function (mess, pseudo) {
          console.log('message : ' + mess + ' de ' + pseudo);
          socket.broadcast.emit('message', {pseudo: pseudo, message: mess});
      });

    });

		server.listen(8080);
		return router;
	}

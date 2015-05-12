var express = require('express');
var moment = require('moment');
var request = require('request');
var authenticate = require('../passport/authenticate.js');

var router = express.Router();

var tweet = require('../models/tweet');
var User = require('../models/user');
var msg = require('../models/msg');



var server = require('http').createServer(router),
    io = require('socket.io').listen(server),
    fs = require('fs');

	module.exports = function(passport){

	  // message

		router.get('/message', authenticate.auth, function(req, res){
			res.render('message', {user: req.user});
		});

		var io = require('socket.io').listen(server);

		// Quand on client se connecte
    io.sockets.on('connection', function (socket, pseudo) {


      socket.on('message', function (mess, pseudo) {
          socket.broadcast.emit('message', {pseudo: pseudo, message: mess});
      });

    });

		server.listen(8080);
		return router;
	}

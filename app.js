var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var formidable = require('formidable');

var dbConfig = require('./db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);

var app = express();

var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.enable('trust proxy');

// configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

// initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

// routes
var routes = require('./routes/index')(passport);
var messages= require('./routes/messages')(passport);
var profiles= require('./routes/profiles')(passport);
var home= require('./routes/home')(passport);
var search= require('./routes/search')(passport);
app.use('/', routes);
app.use('/', messages);
app.use('/', home);
app.use('/', profiles);
app.use('/', search);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        if(err.status == 404)
        {
          res.render('404');
        }
        else
        {
        res.render('error', {
            message: err.message,
            error: err
        });
        }
    });
}

module.exports = app;

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session')
var multipart = require('connect-multiparty');

var samlAuth = require('./routes/saml-auth');
var index = require('./routes/index');
var login = require('./routes/login');

var upload = require('./routes/auth/upload');
var documents = require('./routes/auth/documents');
var authIndex = require('./routes/auth/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'vash');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipart());
app.use(session({
  secret: 'LDX File Uploader',
  resave: false,
  saveUninitialized: true,
  cookie: {}
}))

app.use(samlAuth.initialize());
app.use(samlAuth.session());

app.use('/', index);
app.use('/login', login);

// app.use('/auth/*', function (req, res, next) {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   res.redirect('/login');
// });

app.use('/auth/', authIndex);
app.use('/auth/upload', upload);
app.use('/auth/documents', documents);

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

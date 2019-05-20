var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
const passportSetup = require('./config/passport-setup');
const cookieSession = require('cookie-session');
const passport = require('passport');
const cors = (require('cors'));
const bodyParser = (require('body-parser'));

//import router files
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var eventRouter = require('./routes/events');
var profileRouter = require('./routes/profile');
var messageRouter = require('./routes/messages');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({credentials: true, origin: 'https://david92932.github.io'}));
app.use(logger('dev'));

//app.use(express.json());
app.use(bodyParser.json());

//app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000 * 365,
  keys: ['TheRealBrosOfSimiValley']
}));

//mongodb
mongoose.connect('mongodb+srv://david92392:qwertyuiop@sportsfinder-ojvak.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).catch(function(err){console.log(err)});

//initialize passport
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use('/events', eventRouter);
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/messages', messageRouter);

app.post('/testEnd', function(req, res)
{

  console.log('testing triggered');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.json('Hello From the Server!');


});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressHbs = require('express-handlebars');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mongoose  = require('mongoose');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var validator = require('express-validator');

// const { MongoClient } = require("mongodb");

var app = express();


const db = require('./config/keys').MongoURI;
console.log(db);
mongoose.connect(db, { useNewUrlParser : true})
.then(() =>{
  console.log("mongoose connected");
})
.catch(err => console.log(err)) 

require('./config/passport');

// view engine setup
app.engine('.hbs',expressHbs({defaultLayout :'layout',extname:'.hbs'}))
app.set('view engine', '.hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret:"my super secret",
resave:false,
saveUninitialized:false,
 store: new MongoStore({mongooseConnection:mongoose.connection}),
 cookie:{maxAge:180*60*1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    res.locals.session = req.session;
    next();
})

app.use('/', indexRouter);
app.use('/users', usersRouter);

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

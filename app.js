require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const bcrypt        = require("bcryptjs");
const session       = require("express-session");
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash         = require("connect-flash");
const User          = require("./models/user/User");

// Register HBS partial views
hbs.registerPartials(__dirname+"/views/partials");

// Register HBS value query helper
hbs.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Connect to DB
mongoose.set('useCreateIndex', true);
mongoose
  .connect('mongodb://localhost/real-print', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express sessions
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

// Setup Flash messages
app.use(flash());

// Setup passport using email and local strategy
passport.use(new LocalStrategy(
  {usernameField: 'email', passwordField: 'password'},
  function(username, password, done) {
    User.findOne({ email: username }, (err, user)=> {
      if(err){
        return done(err);
      }
      if(!user){
        return done(null, false, {message: 'Incorrect email or password.'});
      }
      if(!bcrypt.compareSync(password, user.password)){
        return done(null, false, {message: 'Incorrect email or password.'});
      }
      return done(null, user);
    });
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) { return cb(err); }
    cb(null, user);
  });
});

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
  res.locals.user = req.user;
  res.locals.error = req.flash('error');
  res.locals.message = req.flash('success');
  next();
});

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

//Global error messages get passed to all hbs templates
app.use((req, res, next)=>{
  res.locals.message = req.flash('error');
  next();
});

// Default value for title local
app.locals.title = 'Real Print 3D';

// Routes
const index = require('./routes/index');
app.use('/', index);

const userRoutes = require('./routes/userRoutes');
app.use('/', userRoutes);

module.exports = app;

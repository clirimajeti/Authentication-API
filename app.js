const express = require('express');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const app = express();

// Passport config
require('./config/passport')(passport);

// DB config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
  .then( () => { console.log('MongoDB Connected...') })
  .catch(err => console.log(err));

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());


//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));
app.use('/me', require('./routes/me'));

const PORT = process.env.PORT || 5000;




module.exports = app.listen(PORT, console.log(`Server started on port ${PORT}`));

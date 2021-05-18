const express = require('express');
// const mongoose = require('mongoose');
const db = require('./config/queries')
const cors = require('cors')

const app = express();

app.use(cors())


// DB config
// const db = require('./config/keys').MongoURI;

//Connect to Mongo
// mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then( () => { console.log('MongoDB Connected...') })
//   .catch(err => console.log(err));

// Bodyparser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//Routes
app.use('/', require('./routes/index'));
app.use('/user', require('./routes/users'));
app.use('/me', require('./routes/profile'));
app.use('/cake', require('./routes/cake'));

const PORT = process.env.PORT || 5000;

module.exports = app.listen(PORT, console.log(`Server started on port ${PORT}`));

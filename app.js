const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');


mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    console.log(`Connected to database ${config.database}`);
});
mongoose.connection.on('error', (err) => {
    console.log(`Database error:  ${err}`);
});


const app = express();
const users = require('./routes/users');

// const port = 3000;
app.use(cors())
// for Heroku
const port = process.env.port || 8080;

app.use(bodyParser.json());
app.use('/users', users);

// for JWT
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);


app.use(express.static(path.join((__dirname, 'public'))));


app.get('/', (req, res) => {
    res.send(('Invalid endpoint'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log(`server started on port on port ${port}`)
});

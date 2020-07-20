const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require(('passport'));
const jwt = require(('jsonwebtoken'));
const config = require('../config/database');


router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({succedd: false, msg: 'Failed to register user'});
        } else {
            res.json({succedd: true, msg: 'User registered'});
        }
    });
});

router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.getUserByUserName(username, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({success: false, msg: 'User not found'})
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            console.log("---" + password +":" +  user.password)
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), config.secret, {
                    //const token = jwt.sign(user, config.secret, {
                    expiresIn: 604800 // 1 week
                });
                console.log("TOKEN:" + token);
                res.json({
                    success: true,
                    token: token,
                    // token: 'Bearer ' + token,
                    user: {id: user._id, name: user.name, username: user.username, email: user.email}
                });
                console.log({id: user._id, name: user.name, username: user.username, email: user.email})

            } else {
                res.json({success: false, msg: ' Wrong password'});
            }
        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});


module.exports = router;

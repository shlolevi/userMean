const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/user');
const config = require('../config/database');

module.exports = function(passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = config.secret;
    console.log('----------------PASSPORT-----------------------------');
    passport.use(new JwtStrategy(opts,  (jwt_payload, done) => {
        console.log('---------------- INNER PASSPORT-----------------------------');
        console.log('Payload :: '+jwt_payload._doc);
        console.log(jwt_payload);
        console.log('---------------------------------------------');
        // User.getUserById(jwt_payload._doc._id, (err, user) => {
        User.getUserById(jwt_payload._id, (err, user) => {
            if(err){
                return done(err, false);
            }

            if(user){
                return done(null, user);
            } else{
                return done(null,false);
            }
        });
    }));

}

var mongoose = require('mongoose'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    User = mongoose.model('User')


/**
 * Expose Authentication Strategy
 */

module.exports = Strategy;


/*
 * Defines Passport authentication
 * strategies from application configs
 *
 * @param {Express} app `Express` instance.
 * @api public
 */

function Strategy(app) {

    var config = app.get('config');

    /**
     *  Passport Login Serialization / Deserialization
     */
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(user, done) {
        User.findOne({
            _id: user._id
        }, function(err, user) {
            done(err, user);
        })
    });

    // use twitter strategy
    passport.use(new TwitterStrategy({
            consumerKey: config.twitter.clientID,
            consumerSecret: config.twitter.clientSecret,
            callbackURL: config.twitter.callbackURL
        },
        function(token, tokenSecret, profile, done) {
            User.findOne({
                'twitter.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        emails: profile.emails,
                        photos: profile.photos,
                        provider: 'twitter',
                        twitter: profile._json
                    })
                    user.save(function(err) {
                        if (err) console.log(err)
                        return done(err, user)
                    });
                } else {
                    return done(err, user)
                }
            });
        }
    ));

    // use facebook strategy
    passport.use(new FacebookStrategy({
            clientID: config.facebook.clientID,
            clientSecret: config.facebook.clientSecret,
            callbackURL: config.facebook.callbackURL
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({
                'facebook.id': profile.id
            }, function(err, user) {
                if (err) {
                    return done(err)
                }
                console.log(profile);
                if (!user) {
                    profile_email = (profile.emails) ? profile.emails[0].value : null;
                    user = new User({
                        name: profile.displayName,
                        username: profile.username,
                        emails: profile.emails,
                        photos: profile.photos,
                        provider: 'facebook',
                        facebook: profile._json
                    });
                    user.save(function(err) {
                        if (err) console.log(err)
                        return done(err, user)
                    });
                } else {
                    return done(err, user)
                }
            });
        }
    ));

    // // use google strategy
    // passport.use(new GoogleStrategy({
    //      clientID: config.google.clientID,
    //      clientSecret: config.google.clientSecret,
    //      callbackURL: config.google.callbackURL
    //  },
    //  function(accessToken, refreshToken, profile, done) {
    //      User.findOne({ 'google.id': profile.id }, function (err, user) {
    //          if (!user) {
    //              user = new User({
    //                  name: profile.displayName,
    //                  email: profile.emails[0].value,
    //                  username: profile.username,
    //                  provider: 'google',
    //                  google: profile._json
    //              });
    //              user.save(function (err) {
    //                  if (err) console.log(err)
    //                  return done(err, user)
    //              });
    //          } else {
    //              return done(err, user)
    //          }
    //      });
    //  }
    // ));
}

var mongoose = require('mongoose'),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
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

  var env = app.get('appEnv');

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
      consumerKey:    env.TWITTER_clientID,
      consumerSecret: env.TWITTER_clientSecret,
      callbackURL:    env.TWITTER_callbackURL
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
      clientID:     env.FACEBOOK_clientID,
      clientSecret: env.FACEBOOK_clientSecret,
      callbackURL:  env.FACEBOOK_callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({
        'facebook.id': profile.id
      }, function(err, user) {
        if (err) {
          return done(err);
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
}

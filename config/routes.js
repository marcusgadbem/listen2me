var passport = require('passport'),
    authMiddleware = ('middlewares/authorization');

/**
 * Controllers
 */
var users = require('../app/controllers/users'),
    home = require('../app/controllers/home'),
    channels = require('../app/controllers/channels'),
    loginRequired = require('./middlewares/authorization').requiresLogin;

module.exports = function(app) {

  /**
   * Home
   */
  app.get('/', home.index);

  /**
   * Login
   */
  app.get('/login', users.login);
  app.get('/logout', users.logout);

  /**
   * Channels
   */
  app.get('/channels', loginRequired, channels.index);
  app.post('/channel/create', loginRequired, channels.create);
  app.get('/channel/:id', loginRequired, channels.stream);
  app.del('/channel/:id/destroy', loginRequired, channels.destroy);

  /**
   * Authentications
   */
  var providersPassport = {
    "facebook.auth":      passport.authenticate('facebook', {scope: ['basic_info', 'email'], failureRedirect: '/login'}),
    "facebook.callback":  passport.authenticate('facebook', {failureRedirect: '/login'}),

    "twitter.auth":       passport.authenticate('twitter', {failureRedirect: '/login'}),
    "twitter.callback":   passport.authenticate('twitter', {failureRedirect: '/login'}),

    "google.auth":        passport.authenticate('google', {
                            failureRedirect: '/login',
                            scope: [
                            'https://www.googleapis.com/auth/userinfo.profile',
                            'https://www.googleapis.com/auth/userinfo.email']
                          }),
    "google.callback":    passport.authenticate('google', {failureRedirect: '/login'})
  }

  // Facebook auth / callback
  app.get('/auth/facebook', providersPassport["facebook.auth"], users.signin);
  app.get('/auth/facebook/callback', providersPassport["facebook.callback"], users.authCallback);

  // Twitter auth / callback
  app.get('/auth/twitter', providersPassport["twitter.auth"], users.signin);
  app.get('/auth/twitter/callback', providersPassport["twitter.callback"], users.authCallback);

  // // Google+ Auth
  app.get('/auth/google', providersPassport["google.auth"], users.signin);
  app.get('/auth/google/callback', providersPassport["google.callback"], users.authCallback)

}

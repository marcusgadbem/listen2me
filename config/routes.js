/*!
 * Module dependencies.
 */

var async = require('async'),
    passport = require('passport'),
    utils = require('../lib/utils');

/**
 * Controllers
 */

var users = require('../app/controllers/users'),
    home = require('../app/controllers/home'),
    channels = require('../app/controllers/channels'),
    auth = require('./middlewares/authorization')



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

    app.get('/channels', utils.restrict, channels.index);
    app.post('/channel/create', utils.restrict, channels.create);
    app.get('/channel/:id', utils.restrict, channels.stream);
    app.del('/channel/:id/destroy', utils.restrict, channels.destroy);


    /**
     * Authentications
     */

    // Facebook Auth
    app.get('/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['basic_info', 'email'],
            failureRedirect: '/login'
        }),
        users.signin);

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            failureRedirect: '/login'
        }),
        users.authCallback);

    // Twitter Auth
    app.get('/auth/twitter',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }),
        users.signin);

    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            failureRedirect: '/login'
        }),
        users.authCallback);

    // // Google+ Auth
    // app.get('/auth/google',
    //  passport.authenticate('google', {
    //          failureRedirect: '/login',
    //          scope: [
    //              'https://www.googleapis.com/auth/userinfo.profile',
    //              'https://www.googleapis.com/auth/userinfo.email'
    //          ]
    //  }),
    //  users.signin);

    // app.get('/auth/google/callback',
    //  passport.authenticate('google', {
    //          failureRedirect: '/login'
    //  }),
    //  users.authCallback)

    app.param('userId', users.user)

}

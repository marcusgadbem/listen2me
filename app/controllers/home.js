/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Channel = mongoose.model('Channel')


/**
 * List
 */

exports.index = function(req, res) {
    if (!req.isAuthenticated()) {
        res.render('home/index.ejs', {
            layout: 'layouts/index'
        });
    } else {
        res.redirect('/channels');
    }

}

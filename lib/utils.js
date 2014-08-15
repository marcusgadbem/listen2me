var crypto = require('crypto'),
    type = require('component-type');

/**
 * Merge object `b` into `a`.
 *
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 * @api public
 */

exports.merge = function merge(a, b) {
    for (var key in b) {
        if (exports.has.call(b, key) && b[key]) {
            if ('object' === type(b[key])) {
                if ('undefined' === type(a[key])) a[key] = {};
                exports.merge(a[key], b[key]);
            } else {
                a[key] = b[key];
            }
        }
    }
    return a;
};


/*
 * Restrict paths
 */

exports.restrict = function(req, res, next) {
    if (req.isAuthenticated()) next();
    else res.redirect('/');
};


/*
 * Generates a URI Like key for a room
 */

exports.genRoomKey = function() {
    var shasum = crypto.createHash('sha1');
    shasum.update(Date.now().toString());
    return shasum.digest('hex').substr(0, 6);
};


/*
 * Serialize User to Own a song
 */

exports.serializeUser = function(userShortcut) {
    var photo;
    switch (userShortcut.provider) {
        case 'facebook':
            photo = ['https://graph.facebook.com/', userShortcut.facebook.id,'/picture'].join("");
            break;
        case 'twitter':
            photo = userShortcut.twitter.profile_image_url;
            break;
    }
    return {
        _id: userShortcut._id,
        provider: userShortcut.provider,
        name: userShortcut.name,
        username: userShortcut.username,
        thumbnail: photo
    };
};


/**
 * HOP
 */

exports.has = Object.prototype.hasOwnProperty;

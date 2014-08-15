/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
    Channel = mongoose.model('Channel'),
    utilsMongo = require('../../lib/mongoose-utils'),
    utils = require('../../lib/utils'),
    _ = require('underscore')


/**
 * List
 */

exports.index = function(req, res) {
    //Channel.find({}, {playlist: {$slice: 3}})
    Channel.find({})
            .select('_id name description created_at playlist creator')
            .populate('creator username')
            .sort('-created_at')
            .exec(function(err, channels) {
                if (err) return res.render('500')
                    console.log(channels);
                res.render('channels/index.ejs', {
                    layout: 'layouts/channels',
                    current_user: req.user,
                    channels: channels
                })
        });
}

/**
 * Create an channel
 */

exports.create = function(req, res) {
    var channel = new Channel(req.body.channel),
        channelKey = utils.genRoomKey();

    channel._id = channelKey;
    channel.creator = req.user._id;
    channel.save(function(err) {
        if (err) {
            console.log('*** ERRORZAO: ', err)
            return res.redirect('/');
        }
        console.log("* Channel Object:", channel);
        res.redirect('/');
    });
}


/**
 * Stream an channel
 */

exports.stream = function(req, res) {
    Channel.findOne({_id: req.params.id})
        .populate('creator')
        .populate('playlist.owner')
        .exec(function(err, channel) {
            if (err) return res.render('500')
            res.render('channels/stream.ejs', {
                layout: 'layouts/channel-stream',
                chan: channel,
                current_user: req.user
            })
        });
}


/**
 * Delete an channel
 */

exports.destroy = function(req, res) {
    Channel.remove({
        _id: req.params.id
    }, function(err, chan) {
        req.flash('info', 'Deleted successfully')
        res.redirect('/channels')
    });
}

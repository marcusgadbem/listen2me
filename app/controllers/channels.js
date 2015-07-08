var mongoose = require('mongoose'),
    Channel = mongoose.model('Channel'),
    utilsMongo = require('../../lib/mongoose-utils');

/**
 * List
 */
exports.index = function(req, res) {
  var perPage = 8,
      page = (req.param('page') > 0 ? req.param('page') : 1) - 1;

    Channel
      .find({}, { playlist: { $slice: 5 } })
      .limit(perPage)
      .skip(perPage * page)
      .populate('creator username')
      .sort('-created_at')
      .exec(function(err, channels) {
        if (err) {
          console.log(utilsMongo(err));
          return res.render('500')
        }
        Channel.count().exec(function(err, count) {
          if (err) return res.render('500')
          res.render('channels/index.ejs', {
            layout: 'layouts/channels',
            current_user: req.user,
            channels: channels,
            channels_count: count,
            page: (page+1),
            pages: Math.ceil(count / perPage)
          });
        });
      });

}

/**
 * Create an channel
 */
exports.create = function(req, res) {
  var channel = new Channel(req.body.channel),
      channelKey = Channel.generateChannelKey(channel.name);

  channel._id = channelKey;
  channel.creator = req.user._id;
  channel.save(function(err) {
    if (err) {
      console.log(utilsMongo(err));
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
      if (err) {
        console.log(utilsMongo(err));
        return res.render('500');
      }
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
    if (err) {
      console.log(utilsMongo(err));
      return res.render('500');
    }
    req.flash('info', 'Deleted successfully')
    res.redirect('/channels')
  });
}

var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var ChannelSchema = new Schema({
  _id: { type: String, index: true },
  name: { type: String, default: '' },
  description: { type: String, default: '' },
  // Channel Creator referencing to User
  creator: { type: ObjectId, ref: 'User' },
  // Channel Playlist
  playlist: [{
    video_id:  { type: String },
    video_title:  { type: String, default: '' },
    video_thumbnails: { type: String, default: '' },
    owner: { type: ObjectId, ref: 'User'}
  }],
  playlistCount: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: null }
});

/**
 * Channel methods
 */
ChannelSchema.methods = {
  generateChannelKey: function(channelName) {
    var shasum = crypto.createHash('sha1');
    shasum.update(Date.now().toString() + ' ' + channelName);
    return shasum.digest('hex').substr(0, 6);
  },

  addSong: function(channel, data, successCb, errorCb) {
    return Channel.update({
        _id: channel.id
      }, {
        $push: { playlist: data },
        $inc: { playlistCount: 1 }
      }, {
        upsert: true
      }, function(err) {
        return (err) ? errorCb(err) : successCb(true);
      });
  },

  delSong: function(channel, data, successCb, errorCb) {
    return Channel.update({
        _id: channel.id
      }, {
        $pull: { playlist: { video_id: data.video_id } },
        $inc: { playlistCount: -1 }
      }, {
        upsert: true
      }, function(err) {
        return (err) ? errorCb(err) : successCb(true);
      });
  }
}

/*
 * Hooks
 */
// Generate and set channel key as _id before save
ChannelSchema.pre('save', function (next) {
  this._id = Channel.generateChannelKey(this.get('name'));
  next();
});

// Export
mongoose.model('Channel', ChannelSchema);

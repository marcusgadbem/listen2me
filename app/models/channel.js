// Channel Model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId,
    crypto = require('crypto'),
    _ = require('underscore');


var ChannelSchema = new Schema({

    _id: {
        type: String,
        index: true
    },

    // #Channel-name
    name: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },

    // Channel Creator referencing to User
    creator: {
        type: ObjectId,
        ref: 'User'
    },

    // Channel Playlist
    playlist: [
        {
            video_id:  { type: String },
            video_title:  { type: String, default: '' },
            video_thumbnails: { type: String, default: '' },
            owner: { type: ObjectId, ref: 'User'}
        }
    ],

    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: null
    }
});

mongoose.model('Channel', ChannelSchema);

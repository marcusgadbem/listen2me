var cookie = require('cookie'),
    mongoose = require('mongoose'),
    Channel = mongoose.model('Channel'),
    utilsMongo = require('../../lib/mongoose-utils'),
    utils = require('../../lib/utils'),
    _ = require('underscore'),
    fs = require('fs');


module.exports = function(io, app) {
    var config = app.get('config')

    io.sockets.on('connection', function(socket) {

        /*
         * Sockets Methods:
         *      Streams an Event directly to User
         *          socket.emit()
         *      Streams an Event to every peer
         *          io.sockets.emit()
         *      Emitting an event to all clients in a particular room
         *          io.sockets.in('room').emit('event_name', data)
         *      Emitting an event to all clients
         *          io.sockets.emit('event_name', data)
         *      Emitting an event to all clients in a namespace of a particular room
         *          io.of('namespace').in('room').emit('event_name', data)
         */


        console.log('* Socket: Connected ', socket.handshake.user.name);

        // When connecting, create Channel object on User socket
        // we try to recover stored object in case of re-connection
        socket.handshake.channel = socket.handshake.channel || {};

        // When connection, emite User Object (created by passport.socket.io) to front-end
        // Channel was already printed in 'channel-stream' view
        socket.emit('create_user', {
            user: socket.handshake.user
        });




        socket.on('disconnect', function(data) {
            var channel = socket.handshake.channel,
                userShortcut = socket.handshake.user,
                serializedUser = utils.serializeUser(userShortcut),
                usersCount;

            console.log('* Socket: Dropped ', serializedUser);
            // dead socket needs to be removed from channel?
            socket.leave(channel.id);
            usersCount = io.sockets.clients(channel.id).length;
            io.sockets.in(channel.id).emit('part', {
                user: serializedUser,
                roomCount: usersCount
            });
            socket.handshake.channel = {};
        });


        /**
         *  Channel Sockets
         */

        socket.on('join', function(data) {
            var userShortcut = socket.handshake.user,
                serializedUser = utils.serializeUser(userShortcut),
                usersCount;
            socket.handshake.channel = data;
            socket.join(data.id);
            console.log(serializedUser);
            usersCount = io.sockets.clients(data.id).length;
            io.sockets.in(data.id).emit('join', {
                user: serializedUser,
                roomCount: usersCount
            });
        });


        /**
         *  @songs Sockets
         */

        socket.on('add_song', function(data) {
            var channel = socket.handshake.channel,
                userShortcut = socket.handshake.user,
                serializedUser = utils.serializeUser(userShortcut);
            videoObject = data;

            // set song owner
            videoObject.owner = serializedUser._id;

            Channel.update({
                _id: channel.id
            }, {
                $push: { playlist: data },
                $inc: { playlistCount: 1 }
            }, {
                upsert: true
            }, function(err) {
                if (err) {
                    console.log(err);
                    socket.emit('error', {
                        type: 'add_song',
                        message: err,
                        video: videoObject
                    });
                } else {
                    console.log("Successfully added");
                    // emit to users.
                    io.sockets.in(channel.id).emit('add_song', {
                        user: serializedUser,
                        video: videoObject
                    });
                }
            });

        });


        socket.on('del_song', function(data) {
            var channel = socket.handshake.channel,
                userShortcut = socket.handshake.user,
                serializedUser = utils.serializeUser(userShortcut),
                videoObject = data;

            Channel.update({
                _id: channel.id
            }, {
                $pull: { playlist: { video_id: videoObject.video_id } },
                $inc: { playlistCount: -1 }
            }, {
                upsert: true
            }, function(err) {
                if (err) {
                    console.log(err);
                    socket.emit('error', {
                        type: 'del_song',
                        message: err,
                        video: videoObject
                    });
                } else {
                    console.log("Successfully deleted");
                    // emit to users.
                    io.sockets.in(channel.id).emit('del_song', {
                        user: serializedUser,
                        video: videoObject
                    });
                }
            });

        });
    });

}

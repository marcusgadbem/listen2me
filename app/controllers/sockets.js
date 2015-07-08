var mongoose = require('mongoose'),
    Channel = mongoose.model('Channel'),
    User = mongoose.model('User');

module.exports = function(app, io) {

  io.sockets.on('connection', function(socket) {
    console.log('* Socket: Connected ', socket.handshake.user.name);

    // When connecting, create Channel object on User socket
    // and try to rescue handshake object in case of re-connection
    // or initialize an empty object
    socket.handshake.channel = socket.handshake.channel || {};

    // When handshake happens, emite User Object (created by passport.socket.io) to front-end
    // Channel info was already printed as json in 'channel-stream' view
    socket.emit('create_user', {
      user: socket.handshake.user
    });

    /**
     * User disconnect
     */
    socket.on('disconnect', function(data) {
      var channel = socket.handshake.channel,
          userShortcut = socket.handshake.user,
          serializedUser = User.normalizeUser(userShortcut),
          usersCount;

      console.log('* Socket: Dropped ', serializedUser);
      // dead socket needs to be removed from channel?
      socket.leave(channel.id);
      usersCount = io.sockets.clients(channel.id).length;
      io.sockets.in(channel.id).emit('part', {
        user: serializedUser,
        usersCount: usersCount
      });
      socket.handshake.channel = {};
    });

    /**
     *  Channel Sockets
     */
    socket.on('join', function(data) {
      var userShortcut = socket.handshake.user,
          serializedUser = User.normalizeUser(userShortcut),
          usersCount;
      socket.handshake.channel = data;
      socket.join(data.id);
      console.log(serializedUser);
      usersCount = io.sockets.clients(data.id).length;
      io.sockets.in(data.id).emit('join', {
        user: serializedUser,
        usersCount: usersCount
      });
    });

    /**
     *  @songs Sockets
     */
    socket.on('add_song', function(data) {
      var channel = socket.handshake.channel,
          userShortcut = socket.handshake.user,
          serializedUser = User.normalizeUser(userShortcut),
          videoObj = data;

      // set song owner
      videoObj.owner = serializedUser._id;

      var successCb = function() {
        console.log("Successfully added");
        io.sockets.in(channel.id).emit('add_song', {
          user: serializedUser,
          video: videoObj
        });
      }

      var errorCb =  function(err){
        console.log(err);
        socket.emit('error', {
          type: 'add_song',
          message: err,
          video: videoObj
        });
      }

      Channel.addSong(channel, data, successCb, errorCb);

      // Channel.update({
      //   _id: channel.id
      // }, {
      //   $push: { playlist: data },
      //   $inc: { playlistCount: 1 }
      // }, {
      //   upsert: true
      // }, function(err) {
      //   if (err) {
      //     console.log(err);
      //     socket.emit('error', {
      //       type: 'add_song',
      //       message: err,
      //       video: videoObj
      //     });
      //   } else {
      //     console.log("Successfully added");
      //     // emit to users.
      //     io.sockets.in(channel.id).emit('add_song', {
      //       user: serializedUser,
      //       video: videoObj
      //     });
      //   }
      // });
    });

    socket.on('del_song', function(data) {
      var channel = socket.handshake.channel,
          userShortcut = socket.handshake.user,
          serializedUser = User.normalizeUser(userShortcut),
          videoObj = data;

      var errorCb = function(err) {
        console.log(err);
        socket.emit('error', {
          type: 'del_song',
          message: err,
          video: videoObj
        });
      }

      var successCb = function() {
        console.log("Successfully deleted");
        // emit to users.
        io.sockets.in(channel.id).emit('del_song', {
          user: serializedUser,
          video: videoObj
        });
      }

      Channel.delSong(channel, videoObj, successCb, errorCb);

      // Channel.update({
      //   _id: channel.id
      // }, {
      //   $pull: { playlist: { video_id: videoObj.video_id } },
      //   $inc: { playlistCount: -1 }
      // }, {
      //   upsert: true
      // }, function(err) {
      //   if (err) {
      //     console.log(err);
      //     socket.emit('error', {
      //       type: 'del_song',
      //       message: err,
      //       video: videoObj
      //     });
      //   } else {
      //     console.log("Successfully deleted");
      //     // emit to users.
      //     io.sockets.in(channel.id).emit('del_song', {
      //       user: serializedUser,
      //       video: videoObj
      //     });
      //   }
      // });

    });
  });
}

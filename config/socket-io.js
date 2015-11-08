var sio = require('socket.io'),
    express = require('express'),
    passportSocketIo = require('passport.socketio'),
    cookie = require('cookie'),
    cookieParser = require('cookie-parser'),
    fs = require('fs');

/**
 * Expose Sockets initialization
 */
module.exports = Sockets;

/**
 * Socket.io
 *
 * @param {Express} app `Express` instance.
 * @param {HTTPServer} server `http` server instance.
 * @api public
 */
function Sockets(app, httpServer) {
  var env = app.get('appEnv'),
      sessionStore = app.get('sessionStore'),
      io = sio.listen(httpServer);

    /**
   *   SocketIO environment config.
   */
  io.configure(function() {
    io.set("flash policy server", false);
    io.set("connect timeout", 500);
    io.set("reconnect", true);
    // io.set('close timeout', 60 * 60 * 24); // 24h time out
    // io.set('close timeout', 25);
    // io.disable('heartbeats');
    io.set('heartbeat interval', 20);
    io.set('heartbeat timeout', 60);
    // io.set("polling duration", 10);
  });

  // SocketIO in Development mode
  io.configure('development', function(){
    io.set('log level', 3);
    io.set('log colors', true);
    io.set('transports', ['websocket']);
  });

  // SocketIO in Production mode
  io.configure('production', function(){;
    io.enable('browser client etag gzip');
    io.enable('browser client minification');
      io.set('log level', 1);
      io.set('transports', [
        'websocket',
        'flashsocket',
        'htmlfile',
        'xhr-polling',
        'jsonp-polling'
      ]);
  });

  /**
   *   SocketIO Authorization (handshake with Passport)
   */
  io.set('authorization', passportSocketIo.authorize({
    cookieParser: cookieParser,
    key:         'connect.sid',
    secret:      env.SESSION_SECRET,
    store:       sessionStore,
    success:     onAuthorizeSuccess,
    fail:        onAuthorizeFail,
  }));

  function onAuthorizeSuccess(data, accept){
    console.log('successful connection to socket.io');

    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
  }

  function onAuthorizeFail(data, message, error, accept){
    if(error) {
      throw new Error(message);
    }
    console.log('failed connection to socket.io:', message);

    // We use this callback to log all of our failed connections.
    accept(null, false);
  }

  return io;
}

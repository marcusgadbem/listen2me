var socketsController = (function() {

  'use strict';

  var socket =            null, // socket.io
      socketUrl =         null, // socket.io
      Channel =           {}, // current channel
      User =              {}; // user object

  // connect sockets and start socket listeners
  function init() {
    console.log('* Sockets Init...');

    /*
     * Event Listeners
    */
    // postal.channel('sockets').subscribe('video.add', addSong);
    // postal.channel('sockets').subscribe('video.remove', delSong);

    /*
     *  Socket Setup
     */
    var documentDomain = document.domain;
    socketUrl = (documentDomain.substr(-4) === ".dev")
                    ? [documentDomain, ':8000'].join("")
                    : documentDomain;
    socket = io.connect(['http://', socketUrl].join(""));
    socket.on('connect', function(params) {
        console.log('Connected!');
    });

    /*
     *  Socket Events Listeners
     */
    socket.on('create_user',    _createUserEvent);
    socket.on('join',           _joinEvent);
    socket.on('part',           _partEvent);
    socket.on('add_song',       _addSongEvent);
    socket.on('del_song',       _delSongEvent);
    socket.on('error',          _errorMessageEvent);
  }

  /*
   *  Socket Events
   */

  function _createUserEvent(data) {
    // from socket
    User = data.user;

    // Join User to Channel and store it
    _join(channelObj);
  }

  function _joinEvent(data) {
    console.log('[ User has joined # ', data.user.username ,' ]');
    var user = data.user.username;
    UI.actionLogger({message: user + ' has joined channel', thumbnail: data.user.thumbnail});
    UI.updateOnlineUsers(data.usersCount);
  }

  function _partEvent(data) {
    console.log('[ User has left # ', data.user.username ,' ]');
    var user = data.user.username;
    UI.actionLogger({message: user + ' has left channel',  thumbnail: data.user.thumbnail});
    UI.updateOnlineUsers(data.usersCount);
  }

  function _addSongEvent(data) {
    console.log('[ User has added song # ', data ,' ]');
    console.log('Video: ', data);

    var user = (data.user.username == User.username) ? "YOU!" : data.user.username;
    data.video.prettyOwner = user;
    if (data.video.owner == User._id) { data.video.mine = true; }

    Playlist.pushSong( data.video );
    UI.updateSongsCount();
    UI.printPlaylistItem( data.video );
    UI.actionLogger({message: user + ' has added ' + data.video.videoTitle, thumbnail: data.video.videoThumbnails});
  }

  function _delSongEvent(data) {
    console.log('[ User has deleted song # ', data ,' ]');

    var user = (data.user.username == User.username) ? "YOU!" : data.user.username;
    Playlist.removeSong(data.video);
    UI.updateSongsCount();
    UI.removePlaylistItem( data.video );
    UI.actionLogger({message: user + ' has removed ' + data.video.videoTitle, thumbnail: data.video.videoThumbnails});
  }

  function _disconnectEvent(data) {
    console.log('[ User has disconnected # ', data ,' ]');
    UI.updateOnlineUsers(data.usersCount);
  }

  function _errorMessageEvent(data) {
    console.log('[ An error has occured: ', data ,' ]');
  }

  /*
   *  SocketsController API
   */

  function _join(params) {
    socket.emit('join', params);
    Channel = params;
  }

  function addSong(params) {
    socket.emit('add_song', params);
  }

  function delSong(params) {
    socket.emit('del_song', params);
  }

  /*
   *  Public Methods
   */
  return {
    init:       init,
    addSong:    addSong,
    delSong:    delSong
  }

}( ));

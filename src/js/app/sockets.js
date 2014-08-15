var socketsController = (function() {

	'use strict';

	var 	socket = 			null, // socket.io
			socket_url =		null, // socket.io
			Channel = 			{},	// current channel
			User = 				{};	// user object



	// connect sockets and start socket listeners
	function init () {
		console.log('* Sockets Init...');

		/*
		 * 	Socket Setup
		 */

		socket_url = (document.domain.substr(-4) === ".dev") ? [document.domain, ':8000'].join("") : document.domain;
		socket = io.connect(['http://', socket_url].join(""));
		socket.on('connect', function(params) {
			console.log('Connected!');
		});


		/*
		 * 	Socket Events Listeners
		 */

		socket.on('create_user', 	createUserEvent);
		socket.on('join', 			joinEvent);
		socket.on('part', 			partEvent);
		socket.on('add_song', 		addSongEvent);
		socket.on('del_song', 		delSongEvent);
		socket.on('error', 			errorMessageEvent);

	}





	/*
	 * 	Socket Events
	 */

	function createUserEvent (data) {
		// from socket
		User = data.user;

		// Join User to Channel and store it
		join(channelObj);
    }

    function joinEvent (data) {
        console.log('[ User has joined # ', data.user.username ,' ]');
        var user = data.user.username;
        UI.actionLogger({message: user + ' has joined channel', thumbnail: data.user.thumbnail});

        UI.updateOnlineUsers(data.roomCount);
    }

    function partEvent (data) {
        console.log('[ User has left # ', data.user.username ,' ]');
        var user = data.user.username;
        UI.actionLogger({message: user + ' has left channel',  thumbnail: data.user.thumbnail});
        UI.updateOnlineUsers(data.roomCount);
	}

	function addSongEvent (data) {
		console.log('[ User has added song # ', data ,' ]');
		console.log('Video: ', data);


		var user = (data.user.username == User.username) ? "YOU!" : data.user.username;
        data.video.prettyOwner = user;
		if (data.video.owner == User._id) { data.video.mine = true; }

		Playlist.pushSong( data.video );
        UI.updateSongsCount();
		UI.printPlaylistItem( data.video );
        UI.actionLogger({message: user + ' has added ' + data.video.video_title, thumbnail: data.video.video_thumbnails});
    }

    function delSongEvent (data) {
        console.log('[ User has deleted song # ', data ,' ]');

        var user = (data.user.username == User.username) ? "YOU!" : data.user.username;
        Playlist.removeSong(data.video);
        UI.updateSongsCount();
        UI.removePlaylistItem( data.video );
        UI.actionLogger({message: user + ' has removed ' + data.video.video_title, thumbnail: data.video.video_thumbnails});
	}

	function disconnectEvent (data) {
		console.log('[ User has disconnected # ', data ,' ]');
        UI.updateOnlineUsers(data.roomCount);
	}

	function errorMessageEvent (data) {
		console.log('[ An error has occured: ', data ,' ]');
	}







	/*
	 * 	SocketsController API
	 */

	function join (params) {
		socket.emit('join', params);
		Channel = params;
	}

	function addSong (params) {
		socket.emit('add_song', params);
	}

	function delSong (params) {
		socket.emit('del_song', params);
	}


	/*
	 * 	Public Methods
	 */

	return {
		init: 		init,
		//join: 		join,
		addSong: 	addSong,
		delSong: 	delSong,
	}

}( ));

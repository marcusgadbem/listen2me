/*
 * 	Youtuble player YoutubeController
 *	Reference:
 *		https://developers.google.com/youtube/iframe_api_reference#Events
 */

var Player = (function() {

    'use strict';

    var 	YoutubeController,
    		embedded 		= false,
    		// playst index
    		currentSongIndex = 0;


    /*
     *  Setup / Init
     */

    function init () {
        console.log('Player.init...');
    }


    /*
     *  onYouTubeIframeAPIReady is called when
     *  youtube player and api is loaded
     *
     */
	function onYouTubeIframeAPIReady() {

		// retrieve playlist
		var playlist 	= Playlist.data();

		// first video exists?
		if (!embedded && typeof playlist[0] === 'undefined') {
			console.log('tá vazio viado');
			return false;
		}

		// get first playlist item
		var firstVideoId	= playlist[0].video_id;
		// create player and attach events
		YoutubeController 		= new YT.Player('player-embed', {
			height: '218',
			width: '387',
			videoId: firstVideoId,
			playerVars: {
				'autoplay': 0,
				'controls': 1
			},
			events: {
				//'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});

		// update embedded
		embedded = true;

		console.log('*** Starting YT.Player with videoId ', firstVideoId);

	}

	// // 4. The API will call this function when the video player is ready.
	// function onPlayerReady(event) {
	// 	event.target.playVideo();
	// }



	function onPlayerStateChange(event) {
		console.log('Player event data: ', event.data);

		// Song ended
		if (event.data == YT.PlayerState.ENDED) {
			console.log('PlayNext from onPlayerStateChange...');
			playNext();
		}

	}

	function playVideoById (videoObject) {
		// cache playlist
		var playlist = Playlist.data(),
			playlistLenght = playlist.length,
			i 		 = 0,
			songIndex;
		for (;i<playlistLenght;++i) {
			if (playlist[i].video_id == videoObject.video_id) {
				songIndex = i;
				currentSongIndex = i;
				break;
			}
		}
		playVideo(videoObject);
	}


	function playNext () {
		// cache playlist
		var playlist = Playlist.data();

		// increment song index
		++currentSongIndex;
		// check if exists
		if (currentSongIndex > playlist.length) {
			UI.actionLogger({message: 'Playlist ended!!! :(', thumbnail: ''});
			return false;
		}

		var video 		= Playlist.data()[currentSongIndex];

		playVideo(video);
	}

	function playVideo (videoObject) {
		YoutubeController.loadVideoById(videoObject.video_id, 0);
		//UI.actionLogger('Playing next song: ' + videoObject.video_title );
	}



    /**
 	 * Fetch data from Youtube
 	 * @param {Object} params
 	 * @returns {Object} jQuery Ajax Object
 	 */

    function isEmbedded () {
    	return embedded;
    }

	/*
	 * 	Public Methods
	 */

    return {
    	init: init,
    	onYouTubeIframeAPIReady: onYouTubeIframeAPIReady,
    	playVideoById: playVideoById,
    	isEmbedded: isEmbedded
    }


}());

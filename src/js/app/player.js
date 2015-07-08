/*
 *   Youtube player: YoutubePlayer
 *  Reference:
 *    https://developers.google.com/youtube/iframe_api_reference#Events
 */

var Player = (function() {

  'use strict';

  var   YoutubePlayer,
        embedded     = false,
        // player index
        currentSongObject,
        currentSongIndex = 0;

  /*
   *  Setup / Init
   */
  function init() {
    console.log('Player.init...');
  }

  /*
   *  onYouTubeIframeAPIReady is called when
   *  youtube player and api is loaded
   *
   */
  function onYouTubeIframeAPIReady() {

    // retrieve playlist
    var playlist   = Playlist.data();

    // first video exists?
    if (!embedded && typeof playlist[0] === 'undefined') {
      console.log('* Playlist vazia.');
      return false;
    }

    // get first playlist item
    var firstVideoId  = playlist[0].video_id;
    // create player and attach events
    YoutubePlayer     = new YT.Player('player-embed', {
      height: '218',
      width: '387',
      videoId: firstVideoId,
      playerVars: {
        'autoplay': 0,
        'controls': 1
      },
      events: {
        //'onReady': onPlayerReady,
        'onStateChange': _onPlayerStateChange
      }
    });

    // update embedded
    embedded = true;

    console.log('*** Starting YT.Player with videoId ', firstVideoId);
  }

  // // 4. The API will call this function when the video player is ready.
  // function onPlayerReady(event) {
  //   event.target._playVideo();
  // }

  function _onPlayerStateChange(event) {
    console.log('Player event data: ', event.data);

    // Song ended
    if (event.data == YT.PlayerState.ENDED) {
      console.log('PlayNext from _onPlayerStateChange...');
      _playNext();
    }
  }

  function _playVideoById(videoObject) {
    // cache playlist
    var playlist        = Playlist.data(),
        playlistLenght  = playlist.length,
        i               = 0,
        songIndex;

    for (;i<playlistLenght;++i) {
      if (playlist[i].video_id == videoObject.video_id) {
        songIndex = i;
        currentSongIndex = i;
        break;
      }
    }

    _playVideo(videoObject);
  }

  function _playNext() {
    // cache playlist
    var playlist = Playlist.data();

    // increment song index
    ++currentSongIndex;
    // check if exists
    if (currentSongIndex > playlist.length) {
      UI.actionLogger({message: 'Playlist ended!!! :(', thumbnail: ''});
      return false;
    }

    var video     = Playlist.data()[currentSongIndex];
    _playVideo(video);
  }

  function _playVideo(videoObject) {
    // unselect current song
    if (currentSongObject) {
        UI.getVideoDOM(currentSongObject.video_id).removeClass('current-song');
    }
    // select current song
    UI.getVideoDOM(videoObject.video_id).addClass('current-song');
    // play song
    YoutubePlayer.loadVideoById(videoObject.video_id, 0);
    // store current song
    currentSongObject = videoObject;
  }

  /**
   * Fetch data from Youtube
   * @param {Object} params
   * @returns {Object} jQuery Ajax Object
   */

  function isEmbedded() {
    return embedded;
  }

  /*
   *   Public Methods
   */
  return {
    init: init,
    onYouTubeIframeAPIReady: onYouTubeIframeAPIReady,
    _playVideoById: _playVideoById,
    isEmbedded: isEmbedded
  }

}());

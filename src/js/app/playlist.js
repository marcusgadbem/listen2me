var Playlist = (function() {

  'use strict';

  var   data = [];

  /*
   *  Setup / Init
   */
  function init() {
    console.log('Playlist.init...');

    // postal.channel('playlist').subscribe('data', getData);

    data = channelObj.playlist;
  }

  /**
   * Fetch data from Youtube
   * @param {Object} params
   * @returns {Object} jQuery Ajax Object
   */
  function pushVideo(videoObj) {
    data.push(videoObj);
    // Embed and Start player if not Embeded yet
    if (!Player.isEmbedded()) {
      Player.onYouTubeIframeAPIReady();
    }
    console.log('Data added: ', data);
  }

  function removeVideo(videoObj) {
    for ( var i = 0, dataLength = data.length; i < dataLength; ++i ) {
      if (data[i].videoId == videoObj.videoId) {
        //delete data[i];
        data.splice(i, 1);
        break;
      }
    }
    console.log('Data removed: ', data);
  }

  function getData() {
    return data;
  }

 /*
  *   Public Methods
  */
  return {
    init: init,
    data: getData,
    pushSong: pushVideo,
    removeSong: removeVideo
  }

}());

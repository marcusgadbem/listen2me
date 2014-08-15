var Playlist = (function() {

    'use strict';

    var 	data =            [];



    /*
     *  Setup / Init
     */

    function init () {
        console.log('Playlist.init...');
        data = channelObj.playlist;
    }


    /**
 	 * Fetch data from Youtube
 	 * @param {Object} params
 	 * @returns {Object} jQuery Ajax Object
 	 */

     function push_song (videoObj) {
        data.push(videoObj);
        // Embed and Start player if not Embeded yet
        if (!Player.isEmbedded()) {
            Player.onYouTubeIframeAPIReady();
        }
        console.log('Data added: ', data);
     }

    function remove_song (videoObj) {
        var dataLength   = data.length,
            i           = 0;
        for (i;i<dataLength;++i) {
            if (data[i].video_id == videoObj.video_id) {
                //delete data[i];
                data.splice(i, 1);
                break;
            }
        }

        console.log('Data removed: ', data);
     }


    function getData () {
        return data;
    }
	/*
	 * 	Public Methods
	 */

    return {
    	init: init,
        data: getData,
        pushSong: push_song,
        removeSong: remove_song
    }


}());

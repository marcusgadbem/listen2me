/*
 *
 *  UI View
 *
 */
var UI = (function() {

    'use strict';

    function init() {

        // bind adding song item from search to playlist
        $("#search--result").delegate(".result--item", "click", function(e) {
            console.log('Live click');

            // clone item to playlist
            var $elm = $(this).clone(),
                // create object
                videoObject = {
                    video_id: $elm.data('video-id'),
                    video_title: $elm.data('video-title'),
                    video_thumbnails: $elm.data('video-thumbnail'),
                };

            //printPlaylistItem( videoObject);
            console.log('*** EMIT: ', videoObject);
            socketsController.addSong(videoObject);
            e.preventDefault();
        });

        // Remove Song delegate
        $("#playlist").delegate(".video--remove", "click", function(e) {
            console.log('Live click');

            // clone item to playlist
            var $elm = $(this).parent().parent(),
                // create object
                videoObject = {
                    video_id: $elm.data('video-id'),
                    video_title: $elm.data('video-title'),
                    video_thumbnails: $elm.data('video-thumbnail'),
                };

            //printPlaylistItem( videoObject);
            console.log('*** EMIT: ', videoObject);
            socketsController.delSong(videoObject);
            e.preventDefault();
        });

        // Play Song delegate
        $("#playlist").delegate(".video--title", "click", function(e) {
            // clone item to playlist
            var $elm = $(this).parent().parent(),
                // create object
                videoObject = {
                    video_id: $elm.data('video-id'),
                    video_title: $elm.data('video-title'),
                    video_thumbnails: $elm.data('video-thumbnail'),
                };

            //printPlaylistItem( videoObject);
            console.log('*** Playing... ', videoObject.video_title);
            Player.playVideoById(videoObject);
            e.preventDefault();

        });

        // Controls Events max items: limits to 5
        var $eventsWrapper = $("#events--wrapper"),
            eventItemsCount = 0;
        $eventsWrapper.bind("DOMSubtreeModified", function() {
            if ($eventsWrapper.children().length >= 8) {
                $eventsWrapper.children().last().fadeOut('slow', function(){$(this).remove();});
            }
        });

    };

    function printPlaylistItem(videoObject) {
        var result = tmpl("template-playlist-item", videoObject);
        // render object in playlist
        $(result).hide().appendTo(".room-playlist-tracks").fadeIn("slow");
    }

    function removePlaylistItem(videoObject) {
        console.log('Removing ', videoObject);
        // remove object from playlist
        $('#playlist div[data-video-id="' + videoObject.video_id + '"]').remove();
    }

    /**
     * Print HTML search results from a given object
     * @param {Object} results
     * @returns {Elements} return built HTML elements
     */

    function printSearchResult(results) {
        $('#search--result').empty();
        return $.each(results, function(index, item) {
            var result = tmpl("template-search-result-item", item);
            $(result).hide().appendTo("#search--result").fadeIn("slow");
        });
    }

    function printEventItem(obj) {
        var data = {
            thumbnail: obj.thumbnail,
            event_content: obj.message
        }
        var result = tmpl("template-event-item", data);
        $(result).hide().prependTo("#events--wrapper").fadeIn("slow");
    }

    function printOnlineUsers(n) {
        $('#js--online-users').html(n);
    }

    function updateSongsCount() {
        $('#js--playlist-count').html(Playlist.data().length);
    }

    /*
     *  Public Methods
     */

    return {
        init: init,
        printSearchResult: printSearchResult,
        printPlaylistItem: printPlaylistItem,
        removePlaylistItem: removePlaylistItem,
        actionLogger: printEventItem,
        updateOnlineUsers: printOnlineUsers,
        updateSongsCount: updateSongsCount
    }

}());

//;(function(doc, win, undefined) {
    $(document).ready(function(){

        /**
         *  Foundation: Init
         */

        $(document).foundation();

        // Start Sockets
        socketsController.init();

        // Start Search module
        SearchController.init();

        // Playlist Module
        Playlist.init();

        Player.init();

        // Start UI
        UI.init();

    });
//})(this, window);

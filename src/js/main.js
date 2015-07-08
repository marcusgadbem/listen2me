//;(function(doc, win, undefined) {
  $(document).ready(function(){
    // Init Foundation
    $(document).foundation();
    socketsController.init();
    SearchController.init();
    Playlist.init();
    Player.init();
    UI.init();
  });
//})(this, window);

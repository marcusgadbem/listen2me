var SearchController = (function() {


    var 	_search_obj =            {},
    		_search_results =        [],

    // Parameters: https://developers.google.com/youtube/v3/docs/search/list
    // GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&q=beatles&key={YOUR_API_KEY}
    // X-JavaScript-User-Agent:  Google APIs Explorer
    		Youtube = {
    		    baseUrl:  "https://www.googleapis.com/youtube/v3/search?",
    		    URIOptions:  {
    		        'v':                '3',
    		        'part':             'id,snippet',
    		        'type':             'video',
    		        'order':            'relevance',
    		        'safeSearch':       'strict',
    		        'q':                '{search}',
    		        //'pageToken':      '{pageToken}',
    		        'maxResults':       '50',
    		        'alt':              'json',
    		        'key':              'AIzaSyAA0oE3aj4jlc5rSlstLozOwlPm10p5BaQ'
    		    },
    		    nextSearch: {}
    		};


    /*
     *  Setup / Init
     */

    function init () {
        // Search Form binding
        $('.js--video-search-form').submit(function(e) {
            // Serialize form into JSON and cache it
            _search_obj   = $(this).serializeObject();
            searchTerm();
            e.preventDefault();
        });

    }


    /**
 	 * Fetch data from Youtube
 	 * @param {Object} params
 	 * @returns {Object} jQuery Ajax Object
 	 */

    function searchTerm (params) {
         // Build URI parameters
         var _yt_url     = buildQueryURI(params);

        // Fetch Data
        return $.ajax({
            url:        _yt_url,
            method:     'GET',
            dataType:   "JSON",
            success: function(response) {
                console.log('Success: ', response);
                processSearchData(response)
            },
            error: function(response) {
                console.log('Error: ', response);
            },
            fail: function(jqXHR, textStatus, errorThrown) {
                console.log( "Request failed: " + textStatus );
                console.log( errorThrown );
            }
        });

    }


    /**
 	 * Build Youtube search URI
 	 * 	- merge URI default options with search object
 	 * @param {Object} params
 	 * @returns {Object} Return Youtube full URL with search options
 	 */

    function buildQueryURI (params) {
        // update options for Youtube search
        Youtube.URIOptions.q   = _search_obj.search_term;

        // set next page token if some
        if (Youtube.nextSearch.nextPageToken !== undefined){
            Youtube.URIOptions.pageToken   = Youtube.nextSearch.nextPageToken;
        }

        // encode URI
        var encoded_url_options     = safeEncodeURIComponent(Youtube.URIOptions);

        // put together yt url base + query uri parameters
        return [Youtube.baseUrl, encoded_url_options].join("");
    }


    /**
 	 * Youtube data fetch callback
 	 * 	- iterates through response object, builds the '_search_results' with the needed attributes
 	 *  - store attributes for next pagination
 	 * @param {Object} json
 	 * @returns {Object} Return UI object responsible to print search result data
 	 */

    function processSearchData (json) {

        // reset last result
        _search_results = [];

        // store nextPageToken
        Youtube.nextSearch.nextPageToken   = (json.nextPageToken) ? json.nextPageToken : undefined;

        $.each(json.items, function(index, item) {
            //console.log("* Video OBJ: ", item);
            _search_results.push({
                video_id: item.id.videoId,
                video_title: item.snippet.title, // refineTitle(value.title.$t, __search_obj.search_option, __search_obj.search_term),
                video_description: item.snippet.description, // refineTitle(value.title.$t, __search_obj.search_option, __search_obj.search_term),
                video_thumbnails: item.snippet.thumbnails
            });
        });

        // Call UI View Object to render results
        return UI.printSearchResult(_search_results);
    }


	/*
	 * 	Public Methods
	 */

    return {
    	init: init
    }


}());

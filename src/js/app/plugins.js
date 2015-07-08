/*
 *  BETTER CONSOLE.LOG
 *  Avoid `console` errors in browsers that lack a console.
 */

(function() {
  var method;
  var noop = function () {};
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
      method = methods[length];

      // Only stub undefined methods.
      if (!console[method]) {
          console[method] = noop;
      }
  }
}());

/*
 *  Re-usable DOM objects (DOM caching)
 */
$C = (function($) {
  if (!$) new Error('jQuery must be declared before plugins.js')
  var DOMCACHESTORE = {};
  return function(selector, force) {
    if (DOMCACHESTORE[selector] === undefined || force){
      DOMCACHESTORE[selector] = $(selector);
    }
    return DOMCACHESTORE[selector];
  }
})($);

/*
 *  jQuery Prototype to serialize form to JSON format
 */
$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

/*
 *  Transform JSON into encoded URI
 */
function  safeEncodeURIComponent(data) {
  return Object.keys(data).map(function(k) {
    return [encodeURIComponent(k), '=', encodeURIComponent(data[k])].join("")
  }).join('&')
}

/*
 *  Capitalizes String
 */
String.prototype.capitalize = function(){
    return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
};

// Array.prototype.removeByVideoId = function(key) {
//     for (var i=0;i<this.length;++i) {
//         if (this[i].videoId == key) {
//             delete this[i];
//             return this;
//         }
//     }
//     return this;
// }

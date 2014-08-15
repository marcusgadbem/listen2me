/**
 * Module dependencies.
 */
var fs = require('fs'),
    express = require('express'),
    mongoose = require('mongoose'),
    env = process.env.NODE_ENV || 'development';


/*
 * Create and config server
 */

var app = exports.app = express();


/**
 * Configure application
 */

require('./config')(app);


// Bootstrap db connection
// Connect to mongodb
config = app.get('config');
var connect = function() {
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    }
    mongoose.connect(config.mongoUrl, options)
}
connect()

/**
 * Bootstrap models
 */

var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function(file) {
    if (~file.indexOf('.js')) require(models_path + '/' + file)
})

/*
 * Passportjs auth strategy
 */

require('./config/passport')(app);

/*
 * Routes
 */

require('./config/routes')(app);


port = app.get('port');
exports.server = require('http')
    .createServer(app).listen(port, function() {
        console.log('Listen2me started on port %d', port);
    });

/*
 * Socket.io
 */

// express, socket-io, {redis}
var io = require('./config/socket-io')(app, exports.server, express);

// SocketIO Controllers
require('./app/controllers/sockets')(io, app);


/*
 * Catch uncaught exceptions
 */

process.on('uncaughtException', function(err) {  
    console.log('Exception: ' + err.stack);
});

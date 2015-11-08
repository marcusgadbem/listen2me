/*
 * Create and config express instance
 */
var express = require('express');
var app = express();
require('./config')(app);
var env = app.get('appEnv');

// Connect to mongodb
var mongoose = require('mongoose');
var connectionOptions = {
  server: { socketOptions: { keepAlive: 1 } }
}
mongoose.connect(env.MONGODB_URI, connectionOptions);

/**
 * Models
 *   Look recursively into app/models
 *   and load each class found
 */

var path = require('path');
var fs = require('fs');
var modelsPath = path.join(__dirname, '/app/models');
fs.readdirSync(modelsPath).forEach(function(file) {
  if (~file.indexOf('.js')) require(path.join(modelsPath,file))
});

/**
 * Passport: config. login strategies
 */

require('./config/passport')(app);

/**
 * Routes: setup app routes
 */

require('./config/routes')(app);

/*
 * Start server and bind port
 */
var http = require('http');
var colors = require('colors');
var utils = require('./lib/utils');
var _ = require('lodash');

var httpServer = http.createServer(app).listen(env.PORT, function() {
  // l2m started
  console.log('\n', ' listen2me'.bold.yellow, 'started'.yellow, utils.marks("v").green, '\n  -'.grey);
  // pretty print each env var
  _.each(Object.keys(env), function(key) {
    console.log(utils.marks("[]")[5].grey, key.blue + ':', env[key]);
  });
  // line-break
  console.log('\n');
});

/*
 * Socket.io
 */
// express, socket-io
var io = require('./config/socket-io')(app, httpServer);

// // SocketIO Controllers
require('./app/controllers/sockets')(app, io);

/*
 * Catch uncaught exceptions
 */
process.on('uncaughtException', function(err) {  
  console.log('uncaughtException: %s', err.stack);
});

// Exports express app and http server
exports.app     = app;
exports.server  = httpServer;

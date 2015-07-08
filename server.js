var fs = require('fs'),
    http = require('http'),
    express = require('express'),
    mongoose = require('mongoose'),
    colors = require('colors'),
    utils = require('./lib/utils'),
    _ = require('lodash'),
    envs = {};

/*
 * Create and config server
 */
var app = express();

/**
 * Configure application
 */
require('./config')(app);
envs = app.get('envs');

console.log(envs)

// Connect to mongodb
var connectMongo = function() {
  var options = {
    server: {
      socketOptions: {
        keepAlive: 1
      }
    }
  }

  mongoose.connect(envs.mongodb_uri, options);
}

connectMongo();

/**
 * Bootstrap models
 */
var modelsPath = path.join(__dirname, '/app/models');
fs.readdirSync(modelsPath).forEach(function(file) {
  if (~file.indexOf('.js')) require(path.join(modelsPath,file))
});

/*
 * Passportjs auth strategy
 */
require('./config/passport')(app);

/*
 * Routes
 */
require('./config/routes')(app);

/*
 * Start server and bind port
 */
var httpServer = http.createServer(app).listen(envs.port, function() {
  // l2m started
  console.log('\n', ' listen2me'.bold.yellow, 'started'.yellow, utils.marks("v").green, '\n  -'.grey);
  // pretty print each env var
  _.each(Object.keys(envs), function(key) {
    console.log(utils.marks("[]")[5].grey, key.blue + ':', envs[key]);
  });
  // line-break
  console.log('\n');
});

/*
 * Socket.io
 */
// express, socket-io
var io = require('./config/socket-io')(app, httpServer);

// SocketIO Controllers
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

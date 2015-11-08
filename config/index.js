var path = require('path');
var morgan = require('morgan');
var log = require('debug')('l2m:config');
var express = require('express');
var mongoose = require('mongoose');
var _ = require('lodash');

// app envs
var appEnvKeys = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'SESSION_SECRET',
  'FACEBOOK_clientID',
  'FACEBOOK_clientSecret',
  'FACEBOOK_callbackURL',
  'TWITTER_clientID',
  'TWITTER_clientSecret',
  'TWITTER_callbackURL',
  'GOOGLE_clientID',
  'GOOGLE_clientSecret',
  'GOOGLE_callbackURL'
];
var appEnv = _.pick(process.env, appEnvKeys);

var appRootPath = path.normalize(__dirname + '/..');
var paths = {
  views:  [appRootPath, 'app', 'views'].join('/'),
  public: [appRootPath, 'public'].join('/')
}

/**
 * Expose Configuration scope
 */
module.exports = Config;

/**
 * App config
 */
function Config(app) {

  log("* config:store app related envs");
  app.set('appEnv', appEnv);

  log("* config:showStackError");
  app.set('showStackError', true);

  // must be placed before express.static
  log("* config:compress");
  var compress = require('compression')
  app.use(compress({
    filter: function(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  log('* config:port as %d', appEnv.PORT);
  app.set('port', appEnv.PORT);

  log('* config:view_engine as %s', 'ejs');
  var expressLayouts = require('express3-ejs-layout');
  app.set('views', paths.views);
  app.set('view engine', 'ejs');
  app.use(expressLayouts);

  log('* config:express.static');
  app.use(express.static(paths.public))

  log('* config:cookie_parser');
  var cookieParser = require('cookie-parser');
  app.use(cookieParser());

  log('* config:logger');
  app.use(morgan('dev'));

  log('* config:bodyParser:methodOverride');
  var bodyParser = require('body-parser');
  var methodOverride = require('method-override');
  app.use(bodyParser());
  app.use(methodOverride());

  log('* config:session');
  // sessions
  var session = require('express-session');
  var MongoStore = require('connect-mongo')(session);
  app.set('sessionStore', new MongoStore({
    url:          appEnv.MONGODB_URI,
    collection:   'sessions',
    mongooseConnection: mongoose.connection
  }));
  app.use(session({
    secret:  appEnv.SESSION_SECRET,
    store:   app.get('sessionStore')
  }));

  log('* config:passport');
  var passport = require('passport');
  app.use(passport.initialize());
  app.use(passport.session());

  log('* config:flash_messages');
  var flash = require('connect-flash');
  app.use(flash());

  log('* config:CSRF unless env == \'test\'');
  if (appEnv.NODE_ENV !== 'test') {
    var csrf = require('csurf');
    app.use(csrf())
    app.use(function(req, res, next){
      res.locals.csrf_token = req.csrfToken();
      next();
    })
  }

  log('* config:error_handler if env == \'development\'');
  if (appEnv.NODE_ENV === 'dev') {
    var errorHandler = require('errorhandler')
    app.use(
      errorHandler({
        dumpExceptions: true,
        showStack: true
      })
    );
    app.locals.pretty = true
  }

  return app;
}

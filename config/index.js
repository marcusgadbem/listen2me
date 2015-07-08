var log = require('debug')('l2m:config'),
  //, morgan         = require('morgan')
  express = require('express')
  expressLayouts = require('express3-ejs-layout'),
  flash = require('connect-flash'),
  passport = require('passport'),
  compress = require('compression'),
  favicon = require('serve-favicon'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  cookieParser = require('cookie-parser'),
  session = require('express-session'),
  csrf = require('csurf'),
  errorHandler = require('errorhandler'),
  MongoStore = require('connect-mongo')(session),
  path = require('path'),
  root_path = path.normalize(__dirname + '/..'),
  _ = require('lodash')

/**
 * Expose Configuration scope
 */
module.exports = Config;

/**
 * App config
 */
function Config(app) {

  // default env
  var defaultEnvs = {
    node_env: 'development',
    port: '8000',
    mongodb_uri: 'mongodb://localhost/',
    mongodb_name: 'l2m_development',
    app_name: 'Listen 2 me!',
    app_url: 'http://listen2me.dev',
    session_secret: 'L1st3n2M3',
    services: {
      facebook: {clientID: 'abc', clientSecret: '123', callbackURL: ''},
      twitter: {clientID: 'abc', clientSecret: '123', callbackURL: ''},
      google: {clientID: 'abc', clientSecret: '123', callbackURL: ''}
    }
  }

  // rescue env variables
  var processEnvs = {
    node_env: process.env.NODE_ENV,
    port: process.env.PORT || 5000,
    mongodb_uri: process.env.MONGODB_URI,
    app_name: process.env.APP_NAME,
    app_url: process.env.APP_URL,
    session_secret: process.env.SESSION_SECRET,
    services:{
      facebook: {
        clientID: process.env.FACEBOOK_CLIENTID,
        clientSecret: process.env.FACEBOOK_CLIENTSECRET,
        callbackURL: process.env.FACEBOOK_CALLBACKURL
      },
      twitter: {
        clientID: process.env.TWITTER_CLIENTID,
        clientSecret: process.env.TWITTER_CLIENTSECRET,
        callbackURL: process.env.TWITTER_CALLBACKURL
      },
      google: {
        clientID: process.env.GOOGLE_CLIENTID,
        clientSecret: process.env.GOOGLE_CLIENTSECRET,
        callbackURL: process.env.GOOGLE_CALLBACKURL
      }
    }
  };

  // and merge with default
  var envs = _.assign({}, defaultEnvs, processEnvs);

  // console.log("* Envs:", envs);
  // console.log("\n\n ---------------- \n\n");
  // console.log("* defaultEnvs:", defaultEnvs);
  // console.log("\n\n ---------------- \n\n");
  // console.log("* processEnvs:", processEnvs);
  // console.log("\n\n ---------------- \n\n");
  console.log("* ---------------:", process.env.SESSION_SECRET);

  // storing envs
  log("* config:envs");
  app.set('envs', envs);

  log("* config:showStackError");
  app.set('showStackError', true);

  // must be placed before express.static
  log("* config:compress");
  app.use(compress({
    filter: function(req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
    },
    level: 9
  }))

  // TODO: module missing for express 4
  // log("* config:favicon");
  // app.use(express.favicon())
  // app.use(favicon(__dirname + '/public/favicon.ico'));

  log('* config:port as %d', envs.port);
  app.set('port', envs.port);

  log('* config:view_engine as %s', 'ejs');
  app.set('views', root_path + '/app/views');
  app.set('view engine', 'ejs');
  app.use(expressLayouts);

  log('* config:mongodb_session_store');
  // console.log(envs);
      // console.log('mongodb_uri', envs.mongodb_uri);
  app.set('sessionStore', new MongoStore({
      url: envs.mongodb_uri,
      collection : 'sessions'
    })
  );

  log('* config:views_path');
  app.set('views', root_path + '/app/views');

  log('* config:express.static');
  app.use(express.static(root_path + '/public'))

  log('* config:cookie_parser');
  app.use(cookieParser());

  log('* config:logger');
  //app.use(morgan('dev'));

  log('* config:bodyParser:methodOverride');
  app.use(bodyParser());
  app.use(methodOverride());

  log('* config:session');
  console.log(envs.mongodb_uri)
  app.use(session({
    secret:  envs.session_secret,
    store:   new MongoStore({
      url: envs.mongodb_uri,
      collection : 'sessions'
    })
  }));

  log('* config:passport');
  app.use(passport.initialize());
  app.use(passport.session());

  log('* config:flash_messages');
  app.use(flash());

  log('* config:CSRF unless env == \'test\'');
  if (envs.node_env !== 'test') {
    app.use(csrf())
    app.use(function(req, res, next){
      res.locals.csrf_token = req.csrfToken();
      next()
    })
  }

  log('* config:error_handler iff env == \'development\'');
  if (envs.node_env === 'development') {
    app.use(
      errorHandler({
        dumpExceptions: true,
        showStack: true
      })
    );
    app.locals.pretty = true
  }

}

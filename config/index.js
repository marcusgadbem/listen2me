/**
 * Module dependencies.
 */

var log 				= require('debug')('listenapp:config')

	, express 			= require('express')

	//, morgan 	    	= require('morgan')
	, compress 	    	= require('compression')
	, favicon 	    	= require('serve-favicon')
	, bodyParser     	= require('body-parser')
	, methodOverride   	= require('method-override')
	, cookieParser     	= require('cookie-parser')
	, session 	     	= require('express-session')
	, csrf 		    	= require('csurf')
	, errorHandler    	= require('errorhandler')

	, MongoStore 		= require('connect-mongo')(session)
	, flash 			= require('connect-flash')
	, expressLayouts 	= require('express3-ejs-layout')
	, passport 			= require('passport')
	, path 				= require('path')
	, root_path 		= path.normalize(__dirname + '/..')
	, url 				= require('url')
	, pkg 				= require('../package.json')
	, config			= {}

	, env = process.env.NODE_ENV || 'development'
	, port = process.env.PORT || 8000;


/**
 * Expose Configuration scope
 */

module.exports = Config;

/**
 * Applies configurations settings
 * for application.
 *
 * @param {Express} app `Express` instance.
 * @api public
 */

function Config (app) {

	log("* expose package.json to views");
    app.use(function (req, res, next) {
      res.locals.pkg = pkg
      next()
    })

	log("* showStackError");
	app.set('showStackError', true);

	log("* Enabling Express Compress for assets");
	// should be placed before express.static
	app.use(compress({
		filter: function (req, res) {
			return /json|text|javascript|css/.test(res.getHeader('Content-Type'))
		},
		level: 9
	}))

//	log("* express.favicon()");
//	app.use(express.favicon())
//	app.use(favicon(__dirname + '/public/favicon.ico'));

	log("Attempt to load from config.json")
	config = require('./config')[env];


  	/*
		SETS
  	*/

  	log('Save configuration values in app %j', config);
  	app.set('config', config);

  	log('Setting port as %d', port);
  	app.set('port', port);

  	log('Setting view engine as %s', 'ejs');
  	app.set('views', 		root_path + '/app/views');
	app.set('view engine', 	'ejs');
	app.use(expressLayouts);

  	log('Creating and saving a session store instance with mongo client.');
	app.set('sessionStore', new MongoStore({
			url: config.mongoUrl,
			collection : 'sessions'
	  	})
	);

  	log('Setting views lookup root path.');
  	app.set('views', root_path + '/app/views');

  	/*
		USES
  	*/

	log('Setting static files lookup root path.');
	app.use(express.static(root_path + '/public'))

	log('Use of cookie module parser middleware.');
	app.use(cookieParser());

	log('Log every request to the console');
	//app.use(morgan('dev'));

	log('Use of body-parser module middleware and methodOverride support.');
	app.use(bodyParser());
	app.use(methodOverride());

	log('Use of express session middleware.');
	app.use(session({
		secret:  config.session_secret,
		store: 	new MongoStore({
			url: config.mongoUrl,
			collection : 'sessions'
	  	})
	}));

	log('Use of passport middlewares.');
	app.use(passport.initialize());
	app.use(passport.session());

	log('Use flash between requests.');
	app.use(flash());

    // should be declared after session and flash
	// log('Use View Helpers');
 	// app.use(helpers(pkg.name))

    log('Add CSRF support unless it is TEST environment')
	if (env !== 'test') {
		app.use(csrf())
		app.use(function(req, res, next){
		  res.locals.csrf_token = req.csrfToken();
		  next()
		})
	}

	// development env config
	if ('development' == env) {
	   	app.use( errorHandler({ dumpExceptions: true, showStack: true }) );
		app.locals.pretty = true
	}

// 	Deprecated in ExpressJS 4
//	log('Use of express router.');
//	app.use(app.router);

}

// console.log function
function c ( word ) {
  console.log(word)
}

// ===================
// DECLARING VARIABLES
// ===================
var express             = require( 'express' )
var app                 = express()
var mongoose            = require( 'mongoose' )
var User                = require( './models/User.js' )
var logger              = require( 'morgan' )
var bodyParser          = require( 'body-parser' )
var port                = process.env.PORT         || 3000
var DB                  = process.env.DATABASE_URL || 'mongodb://localhost:27017/fogo'
var Conversation        = require( './models/Conversation.js' )
var conversationsRouter = require( './config/routes/conversationRoutes.js' )
var usersRouter         = require( './config/routes/userRoutes.js' )
var passport            = require( 'passport' )
var expressSession      = require( 'express-session' )
var cookieParser        = require( 'cookie-parser' )
var path                = require( 'path' )
var methodOverride      = require( 'method-override' )

// Connect to database
mongoose.connect( DB )

// express Session and Passport Session
app.use( expressSession( {
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
} ) )

app.use( passport.initialize() )
app.use( passport.session() )

// ===================
// MIDDLEWARE
// ===================
// parse application/json
app.use( bodyParser.json() )
// parse application/vnd.api+json as json
app.use( bodyParser.json( { type: 'application/vnd.api+json' } ) )
// parse application/x-www-form-urlencoded
app.use( bodyParser.urlencoded( { extended: true } ) )
// override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT 
app.use( methodOverride( 'X-HTTP-Method-Override' ) )
// set the static files location /public/img will be /img for users
app.use( express.static( __dirname + '/public' ) ) 
//Morgan logger for console requests
app.use( logger( 'dev' ) )

// ===================
// PASSPORT
// ===================
// Setting up the Passport Strategies
require( './config/passport' )( passport )

// Define sessions
app.use( function ( req, res, next ) {
  console.log('Hello')
  // console.log( req.user )
  global.user = req.user
  console.log( global.user )
  next()
} )



// ===================
// ROUTES
// ===================

// create facebook request
app.get( '/auth/facebook', passport.authenticate( 'facebook', { scope: 'email' } ) )

// Route handler for facebook callback strategy
app.get( '/auth/facebook/callback',
  // Tell passport what to do on success and failure
  passport.authenticate( 'facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  } )
)

//Log the user out
app.get( '/logout', function ( req, res ) {
  req.logout()
  res.redirect( '/' )
} )

app.get( '/map', function ( req, res ) {
  res.sendFile( __dirname + '/views/map.html')
} )

app.use( '/api', usersRouter )
app.use( '/api', conversationsRouter )
// pass our application into our routes
require( './config/routes/staticRoutes' )( app ) 
// ===============
// SERVER PORT
// ==============
app.listen( port )
// shoutout to the user
console.log( 'Magic happens on port ' + port )
// expose app for angular 
exports = module.exports = app

//console.log function
function c( word ) {
	console.log( word )
}


//===================
//DECLARING VARIABLES
//===================
var express             = require( 'express' )
var app                 = express()
var mongoose            = require( 'mongoose' )
var logger				= require( 'morgan')
var bodyParser          = require( 'body-parser' )
var port                = process.env.PORT || 3000
var DB                  = process.env.DATABASE_URL || 'mongodb://localhost:27017/fogo'
var Conversation        = require( './models/Conversation.js' )
var conversationsRouter = require( './config/routes/conversationRoutes.js' )
<<<<<<< HEAD
var passport       		= require( "passport" )
var expressSession 		= require( "express-session" )
var cookieParser   		= require( "cookie-parser" )
=======
>>>>>>> 37a189dbe8406d99d96330d4c4afeec9d6e938a5


//Connect to database
mongoose.connect( DB )

//express Session and Passport Session
app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true 
})
)

app.use(passport.initialize());
app.use(passport.session());



//===================
//MIDDLEWARE
//===================
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json() )
app.use( logger( "dev" ) )



//===================
//PASSPORT
//===================
// Setting up the Passport Strategies
require( "./config/passport" )( passport );
//create facebook request
app.get("/auth/facebook", passport.authenticate( "facebook", { scope: "email" } ) )

//Route handler for facebook callback strategy
app.get("/auth/facebook/callback", 
  //tell passport what to do on success and failure
  passport.authenticate( "facebook", {
    succesRedirect: "/",
    failureRedirect: "/"
  })
)

app.get( "/logout", function ( req, res ) {
  req.logout()
  res.redirect("/")

}) 



//===================
//ROUTES
//===================

//test route for home
app.get( '/', function( req, res ) {
	Conversation.find( function( error, conversations ) {
		if ( error ) {
			res.json( "Error " + error )
		} else {
			c( 'this works' )
	res.json( conversations )

		}
	} )	
} )

app.use( '/api', conversationsRouter )


//===============
//SERVER PORT
//==============
app.listen( port, function() {
	c( 'server running on port ' + port )
} )
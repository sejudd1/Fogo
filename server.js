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
var bodyParser          = require( 'body-parser' )
var port                = process.env.PORT || 3000
var DB                  = process.env.DATABASE_URL || 'mongodb://localhost:27017/fogo'
var Conversation        = require( './models/Conversation.js' )
var conversationsRouter = require( './config/routes/conversationRoutes.js' )


//Connect to database
mongoose.connect( DB )

//===================
//MIDDLEWARE
//===================
app.use( bodyParser.urlencoded( { extended: true } ) )
app.use( bodyParser.json() ) 



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
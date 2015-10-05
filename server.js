//console.log function
function c( word ) {
	console.log( word )
}


//===================
//DECLARING VARIABLES
//===================
var express  = require( 'express' )
var app      = express()
var mongoose = require( 'mongoose' )
var port     = process.env.PORT || 3000
var DB       = process.env.DATABASE_URL || 'mongodb://localhost:27017/fogo'

//Connect to database
mongoose.connect( DB )

//===================
//ROUTES
//===================

//test route for home
app.get( '/', function( req, res ) {
	c( 'this works' )
	res.json( "Hello" )
} )


//===============
//SERVER PORT
//==============
app.listen( port, function() {
	c( 'server running on port ' + port )
} )
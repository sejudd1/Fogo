//===================
//DECLARING VARIABLES
//===================
var Conversation = require( '../models/Conversation.js' )

//==============
//CRUD FUNCTIONS
//==============

function index( req, res ) {
	Conversation.find( function( error, conversations ) {
		if ( error ) {
			res.json( error ) 
		} else {
			res.json( conversations );
		}
	} )
}

function create( req, res ) {
	console.log( "It's in here")
	var conversation = new Conversation()
	//Setting conversation properties
	console.log( conversation )
	conversation.owner = req.body.owner
	conversation.topics = req.body.topics
	conversation.isLive = true
	
	//check if conversation saved
	conversation.save( function( error ) {
		if ( error ) {
			res.json( error )
		} else {
			res.json( conversation )
		}
	} )
}

function update( req, res ) {
	
}

function destroy( req, res ) {
	
}

//=========
//EXPORTS
//==========

module.exports = {
	index: index,
	create: create,
	update: update,
	destroy: destroy
}
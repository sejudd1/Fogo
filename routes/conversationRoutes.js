//===================
//DECLARING VARIABLES
//===================
var express = require( 'express' )
var apiRouter = express.Router()
var Conversation = require( '../models/Conversation.js' )
//=========
//ROUTES
//=========

apiRouter.route( '/conversations' )
	.get( function( req, res ) {
		Conversation.find( function( error, conversations ) {
			if ( error ) {
				res.json( error ) 
			} else {
				res.json( conversations );
			}
		} )
	} )
	.post( function( req, res ) {
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
	} )
	
	
	
	
	module.exports = apiRouter
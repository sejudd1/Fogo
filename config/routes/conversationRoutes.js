//===================
//DECLARING VARIABLES
//===================
var express = require( 'express' )
var apiRouter = express.Router()
var Conversation = require( '../../models/Conversation.js' )
var conversationsController = require( '../../controllers/conversations.js' )
//=========
//ROUTES
//=========

apiRouter.route( '/conversations' )
	.get( conversationsController.index )
	.post( conversationsController.create )
	
	
	
	
	module.exports = apiRouter
//===================
//DECLARING VARIABLES
//===================

var mongoose = require( 'mongoose' )

//===============
//CREATING SCHEMA
//===============
var Conversation = new mongoose.Schema( {
	owner: Number,
	group: [ Number ],
	topics: [ String ],
	location: String,
	isLive: Boolean
} )



//================
//EXPORTING SCHEMA
//================
module.exports = mongoose.model( 'Conversation', Conversation )
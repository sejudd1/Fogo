//===================
//DECLARING VARIABLES
//===================
var mongoose = require( 'mongoose' )

//===============
//CREATING SCHEMA
//===============

module.exports = mongoose.model( 'User', {
	fb:{
		id: String,
		access_token: String,
		firstName: String,
		lastName: String,
		email: String


	}

})
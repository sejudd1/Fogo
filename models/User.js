//===================
//DECLARING VARIABLES
//===================
var mongoose 		= require( 'mongoose' )
var bcrypt 			= require( 'bcrypt-nodejs' )

//===============
//CREATING SCHEMA
//===============

//All user accounts setup within their own object. To link and unlink user accounts.
var userSchema = mongoose.Schema({
	local:{
		email:    String,
		password: String,
	},
	
	fb:{
		id:           String,
		access_token: String,
		firstName:    String,
		lastName:     String,
		email:        String

	}

} )

//Adds Hash to password
userSchema.methods.generateHash = function( password ) {
    return bcrypt.hashSync( password, bcrypt.genSaltSync( 8 ), null )
}
//Validating password
userSchema.methods.validPassword = function( password ) {
    return bcrypt.compareSync( password, this.local.password )
}

//Method to create conversation for user
userSchema.methods.addConversation = function(){}

//Exports Model to the app
module.exports = mongoose.model( 'User', userSchema )
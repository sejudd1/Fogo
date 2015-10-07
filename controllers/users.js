//USERS CONTROLLER
//================

//DECLARING VARIABLES
//===================

var User = require( '../models/user.js' )

//CRUD FUNCTIONS
//==============
//Finds all user objects

	function index( req, res ) {
		User.find( function( err, users ) {
			if ( err ) {
				res.json( 'Uh oh' + err )
			} else {
				res.json( users )
			}
		} )
	}

	function create( req, res ) {
		// make a single user -- create
		var user = new User()

		user.name     = req.body.name
		user.username = req.body.username
		user.password = req.body.password

		user.save(function( err ) {
			if( err ){
				if( err.code == 11000 ) {
					return res.json( { success: false, message: 'username already exists' } )
				} else {
					res.send( err )
				}
			}
			res.json( { success: true, message: 'Account created, Lets FOGO!' } )
		} )
	}

	function show( req, res ) {
		//get a single user -- show
		User.findById(req.params.user_id, function( err, user ) {
			if( err ) res.send( err )
			res.json( user )
		} )
	}

	function update( req, res ) {
		// update a single user -- update
		User.findById( req.params.user_id, function( err, user ) {
			if( err ) res.send( err )

			if( req.body.name ) user.name = req.body.name
			if( req.body.username ) user.username = req.body.username
			if( req.body.password ) user.password = req.body.password

			user.save(function( err ) {
				if( err ) res.send( err )
				res.json( { success: true, message: 'Your FOGO account has been updated!' } )
			} )
		} )
	}

	function destroy( req, res ) {
		// delete a single user -- destroy
		User.remove( {
			_id: req.params.user_id
		}, function( err, user ) {
			if( err ) res.send( err )
			res.json( { success: true, message: 'Your FOGO account has been Deleted' } )
		} )
	}



module.exports = {
	index   : index,
	create  : create,
	show    : show,
	update  : update,
	destroy : destroy

}
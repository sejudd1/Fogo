//===========================
//This is our passport module
//===========================
var mongoose            = require( "mongoose" ),
    User                = mongoose.model( 'User' ),
	FacebookStrategy    = require( 'passport-facebook' ).Strategy,
    LocalStrategy       = require( 'passport-local' ).Strategy

module.exports.delete = function() {
    User.find
}

module.exports = function( passport ) {
	//Get user id to store for session
	passport.serializeUser( function( user, done ) {
		done( null, user._id )
        
	} )

	console.log( module.exports )
	//Grab the user every time we want the whole object in passport
	passport.deserializeUser( function( id, done ) {
		User.findById( id, function( err, user ) {
			done( err, user )
		} )

	} )

//===========
//FACEBOOOK
//===========
	passport.use( 'facebook', new FacebookStrategy( {
        clientID          : process.env.FACEBOOK_API_KEY,
        clientSecret      : process.env.FACEBOOK_API_SECRET,
        callbackURL       : 'http://localhost:3000/auth/facebook/callback',
        enableProof       : true,
        profileFields     : [ 'id', 'name', 'email', 'picture' ]
    }, function( access_token, refresh_token, profile, done ) {
        console.log( process.env.FACEBOOK_API_KEY )
    // Use this to see the information returned from Facebook

        process.nextTick( function() {
           
            User.findOne( { 'fb.id' : profile.id }, function( err, user ) {
                if ( err ) {
                    return done( err )
                } 
                if (!user){  
                    var newUser = new User()
                    newUser.fb.id           = profile.id
                    newUser.fb.access_token = access_token
                    newUser.fb.firstName    = profile.name.givenName
                    newUser.fb.lastName     = profile.name.familyName
                    newUser.fb.email        = profile.emails[0].value
                    newUser.fb.picture		= 'https://graph.facebook.com/' + profile.id + '/picture'
                    console.log(newUser.fb.picture)
                    newUser.save(function( err , user ) {
                        if ( err ) {
                                throw err
                        }
                        return done( null, user )
                    } )

                }
                  return done( null, user )
 
            } )

        } )

    } ) )

}
//===========================
//This is our passport module
//===========================
var mongoose            = require( "mongoose" )
var User                = mongoose.model( 'User' )
var	FacebookStrategy    = require( 'passport-facebook' ).Strategy
var Strategy            = require( 'passport-http-bearer').Strategy
var express             = require('express')
var app                 = express()

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
//Authentication using token
passport.use(  
    new Strategy(
        function(token, done) {
            User.findOne({ access_token: token },
                function(err, user) {
                    if(err) {
                        return done(err)
                    }
                    if(!user) {
                        return done(null, false)
                    }

                    return done(null, user, { scope: 'all' })
                }
            );
        }
    )
)
// Configure Express application.
app.use(require('morgan')('combined'));
//route to require token
app.get(  
    '/profile',
    passport.authenticate('bearer', { session: false }),
    function(req, res) {
        res.send('LOGGED IN as ' + req.user.facebookId + ' - <a href=\"/logout\">Log out</a>')
    }
)
//===========
//FACEBOOOK
//===========
	passport.use( 'facebook', new FacebookStrategy( {
        clientID          : process.env.FACEBOOK_API_KEY,
        clientSecret      : process.env.FACEBOOK_API_SECRET,
        callbackURL       : 'http://localhost:3000/auth/facebook/callback',
        enableProof       : true,
        profileFields     : [ 'id', 'name', 'email', 'photos' ]
    }, function( access_token, refresh_token, profile, done ) {
    // Use this to see the information returned from Facebook

        process.nextTick( function() {
           
            User.findOne( { 'fb.id' : profile.id }, function( err, user ) {
                if ( err ) {
                    return done( err )
                } 
                if (!user){  
                    var newUser             = new User()
                    console.log( profile )
                    newUser.fb.id           = profile.id
                    newUser.fb.access_token = access_token
                    newUser.fb.firstName    = profile.name.givenName
                    newUser.fb.lastName     = profile.name.familyName
                    newUser.fb.email        = profile.emails[0].value
<<<<<<< HEAD
                    newUser.fb.photos		= profile.picture
                    console.log( newUser.fb.photos )
=======
                    newUser.fb.picture		= 'https://graph.facebook.com/' + profile.id + '/picture'
                    console.log(newUser.fb.picture)
>>>>>>> 1782c41dd4eece3f85992610b58659cd4a6b7e09
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
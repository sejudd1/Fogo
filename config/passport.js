//===========================
//This is our passport module
//===========================
var User                = require( '../models/User' )
	FacebookStrategy    = require( 'passport-facebook' ).Strategy
    LocalStrategy       = require( 'passport-local' ).Strategy

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

//============
//LOCAL LOGIN
//============
    
    passport.use( 'local-login', new LocalStrategy ( {
        // By default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        // Allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback : true 
    },
    function( req, email, password, done ) {

        // Asynchronous
        process.nextTick(function() {
            User.findOne( { 'local.email' :  email }, function( err, user ) {
                // If there are any errors, return the error
                if ( err )
                    return done( err )

                // If no user is found, return the message
                if ( !user )
                    return done( null, false, req.flash( 'loginMessage', 'No user found.' ) )

                if ( !user.validPassword( password ) )
                    return done( null, false, req.flash( 'loginMessage', 'Oops! Wrong password.' ) )

                // All is well, return user
                else
                    return done( null, user )
            } )

        } )

    } ) )

    // ==============
    // LOCAL SIGNUP 
    // ==============
    passport.use( 'local-signup', new LocalStrategy( {
        // By default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        // Allows us to pass in the req from our route (lets us check if a user is logged in or not)
        passReqToCallback : true 
    },
    function( req, email, password, done ) {

        // Asynchronous
        process.nextTick( function() {

            //  Whether we're signing up or connecting an account, we'll need
            //  to know if the email address is in use.
            User.findOne( { 'local.email': email }, function( err, existingUser ) {

                // If there are any errors, return the error
                if ( err )
                    return done( err )

                // Check to see if there's already a user with that email
                if ( existingUser ) 
                    return done( null, false, req.flash( 'signupMessage', 'That email is already taken.' ) )

                //  If we're logged in, we're connecting a new local account.
                if( req.user ) {
                    var user            = req.user
                    user.local.email    = email
                    user.local.password = user.generateHash( password )
                    user.save( function( err ) {
                        if ( err )
                            throw err
                        return done( null, user )
                    } )

                } 
                //We're not logged in, so we'll make a brand new user.
                else {
                    //Creates the user
                    var newUser            = new User()

                    newUser.local.email    = email;
                    newUser.local.password = newUser.generateHash(password)

                    newUser.save(function( err ) {
                        if ( err )
                            throw err

                        return done( null, newUser )
                    } )

                }

            } )

        } )

    } ) )


//===========
//FACEBOOOK
//===========
	passport.use( 'facebook', new FacebookStrategy( {
        clientID          : process.env.FACEBOOK_API_KEY,
        clientSecret      : process.env.FACEBOOK_API_SECRET,
        callbackURL       : 'http://localhost:3000/auth/facebook/callback',
        passReqToCallback : true,
        enableProof       : true,
        profileFields     : [ 'id', 'name', 'email', 'picture' ]
    }, function( access_token, refresh_token, profile, done ) {

    // Use this to see the information returned from Facebook

        process.nextTick( function() {

            User.findOne({ 'fb.id' : profile.id }, function( err, user ) {
                if ( err ) {
                    return done( err )
                } else if ( user ) {
                  return done( null, user )
                } else {

                    var newUser = new User()
                    newUser.fb.id           = profile.id
                    newUser.fb.access_token = access_token
                    newUser.fb.firstName    = profile.name.givenName
                    newUser.fb.lastName     = profile.name.familyName
                    newUser.fb.email        = profile.emails[0].value
                    //newUser.fb.photos		= "https://graph.facebook.com/" + profile.username + "/picture" + "&access_token=" + accessToken

                    newUser.save(function( err ) {
                        if ( err ) {
                                throw err
                        }
                        return done( null, newUser )
                    } )
                }

            } )

        } )

    } ) )

}
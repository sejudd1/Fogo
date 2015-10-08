
module.exports = function ( app, passport ) {
  // Home page - Log in Sign up will be visible
  app.get('/', function ( req, res ) {
    res.render('layout.ejs')
  })

  // User Profile
  app.get('/profile', isLoggedIn, function ( req, res ) {
    res.render('profile.ejs', {
      user: req.user
    })
  })

  // Logout
  app.get('/logout', function ( req, res ) {
    req.logout()
    res.redirect('/')
  })

  // ==========================
  // AUTHENTICATE FIRST LOGIN
  // ==========================

  // LOCAL LOG IN
  //app.get('/login', function ( req, res ) {
    //res.render('login.ejs', { message: req.flash('loginMessage') })
  //})
  // process the login form
  //app.post('/login', passport.authenticate('local-login', {
    // redirect to the secure profile section
    //successRedirect: '/profile',
    // redirect back to the signup page if there is an error
  //   failureRedirect: '/login',
  //   failureFlash: true
  // }))

  // SIGNUP ===

  // show the signup form
  // app.get('/signup', function ( req, res ) {
  //   res.render('signup.ejs', { message: req.flash('loginMessage') })
  // })

  // process the signup form
  // app.post('/signup', passport.authenticate('local-signup', {
  //   // redirect to the secure profile section
  //   successRedirect: '/profile',
  //   // redirect back to the signup page if there is an error
  //   failureRedirect: '/signup',
  //   failureFlash: true
  // }))

  // FACEBOOK LOG IN ===

  // send to facebook to do the authentication
  app.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
  )

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect: '/profile',
      failureRedirect: '/'
    }))

  // ===============================================================
    // AUTHORIZE already logged in and Connect/Link to Facebook

  // LOCAL
  // app.get('/connect/local', function ( req, res ) {
  //   res.render('connect-local.ejs', { message: req.flash('loginMessage') })
  // })
  // app.post('/connect/local', passport.authenticate('local-signup', {
  //   // redirect to the secure profile section
  //   successRedirect: '/profile',
  //   // redirect back to the signup page if there is an error
  //   failureRedirect: '/connect/local',
  //   failureFlash: true
  // }))

  // FACEBOOK

  // send to facebook to do the authentication
  //app.get('/auth/facebook', passport.authorize('facebook', { scope: 'email', 'photos' }))

  // handle the callback after facebook has authorized the user
  // app.get('/auth/facebook/callback',
  //   passport.authorize('facebook', {
  //     successRedirect: '/profile',
  //     failureRedirect: '/'
  //   }))
    // ================
    // UNLINK ACCOUNTS
    // ================
    // user account will stay active in case they want to reconnect in the future

  // LOCAL  - remove email and password
  // app.get('/unlink/local', function ( req, res ) {
  //   var user = req.user
  //   user.local.email = undefined
  //   user.local.password = undefined
  //   user.save(function ( err ) {
  //     res.redirect('/profile')
  //   })
  // })

  // FACEBOOK - remove token
  app.get('/unlink/facebook', function ( req, res ) {
    var user = req.user
    user.facebook.token = undefined
    user.save(function ( err ) {
      res.redirect('/profile')
    })
  })

  // route middleware to ensure user is logged in
  function isLoggedIn ( req, res, next ) {
    if ( req.isAuthenticated())
      return next()

    res.redirect('/')
  }
}

//===================
//DECLARING VARIABLES
//===================
var express                 = require( 'express' )
var apiRouter               = express.Router()
var usersController         = require( '../../controllers/users.js' )
//=========
//ROUTES
//=========

apiRouter.route( '/users' )
	.get( usersController.index )
	.post( usersController.create )

apiRouter.route( '/users/:user_id' )
	.get( usersController.show )
	.patch( usersController.update )
	.delete( usersController.destroy )	
	
	
	
module.exports = apiRouter


// module.exports = function ( app, passport ) {
//   // Home page - Log in Sign up will be visible
//   app.get('/', function ( req, res ) {
//     res.render('layout.ejs')
//   })

//   // User Profile
//   app.get('/profile', isLoggedIn, function ( req, res ) {
//     res.render('profile.ejs', {
//       user: req.user
//     })
//   })

//   // Logout
//   app.get('/logout', function ( req, res ) {
//     req.logout()
//     res.redirect('/')
//   })

//   // ==========================
//   // AUTHENTICATE FIRST LOGIN
//   // ==========================

//   // LOCAL LOG IN
//   app.get('/login', function ( req, res ) {
//     res.render('login.ejs', { message: req.flash('loginMessage') })
//   })
//   // process the login form
//   app.post('/login', passport.authenticate('local-login', {
//     // redirect to the secure profile section
//     successRedirect: '/profile',
//     // redirect back to the signup page if there is an error
//     failureRedirect: '/login',
//     failureFlash: true
//   }))

//   // SIGNUP ===

//   // show the signup form
//   app.get('/signup', function ( req, res ) {
//     res.render('signup.ejs', { message: req.flash('loginMessage') })
//   })

//   // process the signup form
//   app.post('/signup', passport.authenticate('local-signup', {
//     // redirect to the secure profile section
//     successRedirect: '/profile',
//     // redirect back to the signup page if there is an error
//     failureRedirect: '/signup',
//     failureFlash: true
//   }))

//   // FACEBOOK LOG IN ===

//   // send to facebook to do the authentication
//   app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

//   // handle the callback after facebook has authenticated the user
//   app.get('/auth/facebook/callback',
//     passport.authenticate('facebook', {
//       successRedirect: '/profile',
//       failureRedirect: '/'
//     }))

//   // ===============================================================
//     // AUTHORIZE already logged in and Connect/Link to Facebook

//   // LOCAL
//   app.get('/connect/local', function ( req, res ) {
//     res.render('connect-local.ejs', { message: req.flash('loginMessage') })
//   })
//   app.post('/connect/local', passport.authenticate('local-signup', {
//     // redirect to the secure profile section
//     successRedirect: '/profile',
//     // redirect back to the signup page if there is an error
//     failureRedirect: '/connect/local',
//     failureFlash: true
//   }))

//   // FACEBOOK

//   // send to facebook to do the authentication
//   app.get('/connect/facebook', passport.authorize('facebook', { scope: 'email' }))

//   // handle the callback after facebook has authorized the user
//   app.get('/connect/facebook/callback',
//     passport.authorize('facebook', {
//       successRedirect: '/profile',
//       failureRedirect: '/'
//     }))
//     // ================
//     // UNLINK ACCOUNTS
//     // ================
//     // user account will stay active in case they want to reconnect in the future

//   // LOCAL  - remove email and password
//   app.get('/unlink/local', function ( req, res ) {
//     var user = req.user
//     user.local.email = undefined
//     user.local.password = undefined
//     user.save(function ( err ) {
//       res.redirect('/profile')
//     })
//   })

//   // FACEBOOK - remove token
//   app.get('/unlink/facebook', function ( req, res ) {
//     var user = req.user
//     user.facebook.token = undefined
//     user.save(function ( err ) {
//       res.redirect('/profile')
//     })
//   })

//   // route middleware to ensure user is logged in
//   function isLoggedIn ( req, res, next ) {
//     if ( req.isAuthenticated())
//       return next()

//     res.redirect('/')
//   }
// }


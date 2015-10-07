// console.log function
function c ( word ) {
  console.log(word)
}

// ===================
// DECLARING VARIABLES
// ===================
var express = require('express')
var app = express()
var mongoose = require('mongoose')
var logger = require('morgan')
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var DB = process.env.DATABASE_URL || 'mongodb://localhost:27017/fogo'
// var Conversation = require('./models/Conversation.js')
var conversationsRouter = require('./config/routes/conversationRoutes.js')
var passport = require('passport')
var expressSession = require('express-session')
var cookieParser = require('cookie-parser')
var path = require('path')
var methodOverride = require('method-override')

// Connect to database
mongoose.connect(DB)

// express Session and Passport Session
app.use(expressSession({
  secret: 'mySecretKey',
  resave: true,
  saveUninitialized: true
})
)

app.use(passport.initialize())
app.use(passport.session())

// ===================
// MIDDLEWARE
// ===================
app.use(bodyParser.json()) // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')) // set the static files location /public/img will be /img for users

app.use(logger('dev'))

// ===================
// PASSPORT
// ===================
// Setting up the Passport Strategies
require('./config/passport')(passport)

// Define sessions
app.use(function ( req, res, next ) {
  console.log('Hello')
  // console.log( req.user )
  global.user = req.user
  console.log(global.user)
  next()
})

// create facebook request
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

// Route handler for facebook callback strategy
app.get('/auth/facebook/callback',
  // Tell passport what to do on success and failure
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/'
  })
)

app.get('/logout', function ( req, res ) {
  req.logout()
  res.redirect('/')

})

// ===================
// ROUTES
// ===================

// test route for home
// app.get('/', function ( req, res ) {
//   Conversation.find(function ( error, conversations ) {
//     if ( error ) {
//       res.json('Error ' + error)
//     } else {
//       c('this works')
//       c(req.isAuthenticated)
//       res.json(conversations)

//     }
//   })
// })

app.get('/map', function ( req, res ) {
  res.sendFile(__dirname + '/views/map.html')
})

app.use('/api', conversationsRouter)
require('./config/routes/staticRoutes')(app) // pass our application into our routes
// ===============
// SERVER PORT
// ==============
app.listen(port)
console.log('Magic happens on port ' + port) // shoutout to the user
exports = module.exports = app // expose app for angular

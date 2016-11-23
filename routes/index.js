var express = require('express');
var router = express.Router();
var passport = require('passport')

var pagesController = require('../controllers/pages');

router.get('/api/random', pagesController.apiDetails)
router.get('/', pagesController.welcome)
router.get('/welcome', pagesController.welcome)

// The root route renders our only view
router.get('/index', function(req, res,next) {
  res.render('index', { title: 'Jeopardy with Friends - Live!', user: req.user });

});
router.get('/logged-out', function(req, res,next) {
  res.render('logout', { title: 'Jeopardy with Friends - Live!', user: req.user });

});

// Google OAuth login route
router.get('/auth/google', passport.authenticate(
  'google',
  { scope: ['profile', 'email'] }
));

// Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  'google',
  {
    successRedirect : '/index',
    failureRedirect : '/welcome'
  }
));

// OAuth logout route
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/logged-out');
});


module.exports = router;

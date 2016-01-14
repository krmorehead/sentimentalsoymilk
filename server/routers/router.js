var controller = require('../controllers/controller.js');
var userController = require('../controllers/userController.js');
var dbController = require('../models/dbroutes.js');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var GoogleStrategy = require('passport-google-oauth2').Strategy;
var keys = require('../env/config');

module.exports = function(app, express) {

  //####### Documentation in Controller
  app.post('/api/login', userController.login);
  app.get('/api/loggedin', userController.authCheck);
  // app.post('/api/signup', userController.signup);
  app.get('/logout', userController.logout);
  //originally stored data if it was the first time
  //removed storage because that data changes over time

  // app.get('/activities/*', controller.searchStoredData, controller.fetchCityData);
  app.get('/photos/*', controller.fetchPhotos)
  app.get('/activities/*', controller.fetchCityData);
  app.post('/trips', controller.createTrip);
  app.get('/trips/:id', controller.accessTrip);
  app.get('/trips', controller.getAllTrips);

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  passport.use(new InstagramStrategy({
      clientID: keys.INSTAGRAM_CLIENT_ID,
      clientSecret: keys.INSTAGRAM_CLIENT_SECRET,
      callbackURL: 'http://localhost:8080/auth/instagram/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        //console.log('IG profile', profile);
        //console.log('token', accessToken);
        userController.storeUser(profile, accessToken);
        profile.token = accessToken;
        return done(null, profile);
      });
    }
  ));

  passport.use(new GoogleStrategy({
      clientID: keys.GOOGLE_CLIENT_ID,
      clientSecret: keys.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://127.0.0.1:8080/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      process.nextTick(function () {
        // console.log('Google profile', profile);
        // console.log('token', accessToken);
        userController.storeUser(profile, accessToken);
        profile.token = accessToken;
        return done(null, profile);
      });
    }
  ));

  app.get('/auth/instagram', passport.authenticate('instagram'));
  app.get('/auth/instagram/callback',
    passport.authenticate('instagram', { failureRedirect: '/login' }),
    function(req, res) {
      console.log('logged in user', req.user);
      res.redirect('/#');
    });
  app.get('/auth/google', passport.authenticate('google', {scope: [
    'https://www.googleapis.com/auth/plus.login',
    'https://www.googleapis.com/auth/plus.profile.emails.read']
  }));
  app.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
      console.log('logged in user', req.user);
      req.user.username = req.user.email;
      res.redirect('/#');
    });
  app.get('/api/weather/*', controller.fetchWeatherData);

 //###### Live but not used in production############
  // app.get('/api/user/*', userController.findUser);
  // app.get('/api/ig', userController.fetchIGPhotos);
  // app.put('/api/user/*', userController.addTrips);
  app.get('/api/user/trips/*', userController.findAllUserTrips);


  //############Pending Routes#####################
  // app.get('/api/user/*/*', userController.findOneUserTrip);
  // app.get('/user', controller.checkAuth);
  // app.get('/activities/*', controller.fetchCityData);
  // app.get('/db/activities', dbController.retrieveActivities);
  // app.post('/db/activities', dbController.storeActivities);
  // app.delete('/trips', controller.deleteTrip);

}
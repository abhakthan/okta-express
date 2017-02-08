var passport = require('passport');
var conf = require('./config.json');
var SamlStrategy = require('passport-saml').Strategy;

passport.use(new SamlStrategy(conf.saml,
  function (profile, done) {
    if (!profile.nameID) {
      return done(new Error("No email found"), null);
    }
    process.nextTick(function () {
      return done(null, profile.nameID);
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (id, done) {
  done(null, id);
});

exports = module.exports = passport;
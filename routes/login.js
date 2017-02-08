var express = require('express');
var router = express.Router();
var passport = require('./saml-auth.js');

/* GET login page. */
router.get('/',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function (req, res) {
    res.redirect('/');
  }
);

router.post('/callback',
  passport.authenticate('saml', { failureRedirect: '/', failureFlash: true }),
  function (req, res) {
    res.redirect('/auth/');
  }
);

module.exports = router;

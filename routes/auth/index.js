var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('auth/index', { title: 'LDX File Uploader' });
});

module.exports = router;

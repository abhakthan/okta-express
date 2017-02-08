var fs = require('fs');
var express = require('express');
var mime = require('mime');
var config = require('../config.json');
var router = express.Router();

router.get('/viewer/:fileName', function (req, res, next) {
  var fileName = req.param('fileName');

  if (fileName) {
    var mimetype = mime.lookup(fileName);
    if (mimetype === 'image/tiff') {
      var _fn = fileName.split('.');
      _fn.pop();
      _fn.push('pdf');
      fileName = config.pdfDir + _fn.join('.');
    } else {
      fileName = config.otherDir + fileName;
    }
    var mimetype = mime.lookup(fileName);
    res.setHeader('Content-type', mimetype);
    res.download(fileName);
  } else {
    res.sendStatus(202);
  }
});

router.get('/download/:fileName', function (req, res, next) {
  var fileName = req.param('fileName');
  if (fileName) {
    res.setHeader('Content-disposition', 'attachment; filename=' + fileName);
    fileName = config.otherDir + fileName;
    var mimetype = mime.lookup(fileName);
    res.setHeader('Content-type', mimetype);
    res.download(fileName);
  } else {
    res.sendStatus(202);
  }
});

router.get('/', function (req, res, next) {
  fs.readdir(config.otherDir, (err, files) => {

    if (!files || files.length == 0) {
      res.send([]);
    } else {
      var list = []
      files.forEach(file => getStats(file, function (details) {
        list.push(details);

        if (files.length === list.length) {
          res.json(list);
        }
      }));
    }
  });
});

function getStats(filename, callback) {
  fs.stat(config.otherDir + filename, function (err, stats) {
    var ext = mime.lookup(config.otherDir + filename);
    callback({
      name: filename,
      size: stats['size'],
      date: stats['birthtime'],
      isPdf: (ext === 'image/tiff' ? true : false)
    })
  });
}

module.exports = router;
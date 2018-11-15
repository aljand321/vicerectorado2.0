var express = require('express')
var fs = require('fs')
var path = require('path')
var util = require('util')
const Pdf = require('../models/pdf');
var router = express.Router()

function filterDotFiles (files) {
  return files.filter(f => f.match(/^[^.].*$/))
}

router.get('/', function (req, res, next) {

  var data = req.query;
  Pdf.find({_id:data.id}).exec(function(err, docs) {
    var name = docs.physicalpath.split("/")[2];
    //res.redirect("http://localhost:3000/documents/"+name);
    res.send("http://localhost:3000/documents/"+name);
  });
  /*
  const testFolder = path.join('/home/alejandro/vicerrectorado2.0/public/documents/')
  var readdir = util.promisify(fs.readdir)

  return readdir(testFolder)
    .then(filterDotFiles)
    .then(files => {
      res.render('files.ejs', {files})
    })
    .catch(next)*/
})

module.exports = router;

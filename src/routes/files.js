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

//  const testFolder = path.join(__dirname, '../public/documents/doc-1541766340046.pdf')


  var data = req.query;
  Pdf.find({_id:data.id}).exec(function(err, docs) {
    var name = docs.physicalpath.split("/")[2];
    //res.redirect("http://localhost:3000/documents/"+name);
    res.send("http://localhost:3000/documents/"+name);
  });
  /*
  const testFolder = path.join('/home/alejandro/vicerrectorado2.0/public/documents/')
>>>>>>> c076316fab57370901b93126d5efeefbf6df1235
  var readdir = util.promisify(fs.readdir)

  return readdir(testFolder)
    .then(filterDotFiles)
    .then(files => {
      res.render('files.ejs', {files})
    })
    .catch(next)*/
})

module.exports = router;

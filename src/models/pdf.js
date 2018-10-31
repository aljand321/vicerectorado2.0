const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var pdfSchema = {
  id_ref : String,
  name : String,
  physicalpath : String,
  relativepath : String
};
var pdf= mongoose.model("pdf", pdfSchema);
module.exports = pdf;

const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
const agrSchema = {
  carrera : String,
  gestion: String,
  periodo: String,
  tipoBeca: String,
  id_log:String
};
var agrupare = mongoose.model("agrupare", agrSchema);
module.exports = agrupare;

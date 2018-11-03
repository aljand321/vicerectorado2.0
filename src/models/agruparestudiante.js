const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var agrSchema = {
  carrera : String,
  gestion: String,
  periodo: String,
  id_log:String
};
var agrupare = mongoose.model("agrupare", agrSchema);
module.exports = agrupare;

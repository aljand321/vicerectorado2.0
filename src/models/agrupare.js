const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var agrSchema = {
  gestion : String,
  date: String,
  tipo: String,
  carrera : String,
  id_log:String
};
var agrupare = mongoose.model("agrupare", agrSchema);
module.exports = agrupare;

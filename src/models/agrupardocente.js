const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var agdSchema = {
  carrera : String,
  gestion : String,
  periodo: String,
  id_log : String
};
var agrupard= mongoose.model("agrupard", agdSchema);
module.exports = agrupard;

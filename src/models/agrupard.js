const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var agdSchema = {
  n_carrera : String,
  gestion : String,
  date: String,
  carrera : String,
  id_log : String
};
var agrupard= mongoose.model("agrupard", agdSchema);
module.exports = agrupard;

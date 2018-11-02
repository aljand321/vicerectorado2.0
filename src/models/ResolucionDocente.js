const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var cardocSchema = {
  noresolucion : String,
  nodictamen : String,
  pdf :Array,
  obs: String,
  id_a: {type: Schema.ObjectId, ref: "agrupard"},
  fecha : String

};
var docente = mongoose.model("docente", cardocSchema);
module.exports = docente;

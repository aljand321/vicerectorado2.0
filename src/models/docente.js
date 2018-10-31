const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var cardocSchema = {
  nod : String,
  nor : String,
  pdf :Array,
  obs: String,
  id_a: {type: Schema.ObjectId, ref: "agrupard"}

};
var docente = mongoose.model("docente", cardocSchema);
module.exports = docente;

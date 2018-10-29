const mongoose = require("../connect");
const Schema = require("mongoose").Schema;
var cardocSchema = {
  nombre : String,
  id_carrera : String,
  gestion : String,
  date: String,
  resol: {type: Schema.ObjectId, ref: "resolucion"}
};
var docente = mongoose.model("docente", cardocSchema);
module.exports = docente;

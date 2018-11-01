const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
var resSchema = {
  nr: String,
  nd : String,
  carrera: String,
  facultad: String,
  archivo: Array,
  gestion_est : String,
  obs : String,
  id_c: {type: Schema.ObjectId, ref: "career"}
};
var resolucion= mongoose.model("resolucion", resSchema);
module.exports = resolucion;

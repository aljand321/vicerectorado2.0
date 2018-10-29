const mongoose = require("../connect");
const Schema = require("mongoose").Schema;
var resSchema = {
  id_r : String,
  name : String,
  physicalpath : String,
  relativepath : String
};
var resolucion= mongoose.model("resolucion", resSchema);
module.exports = resolucion;

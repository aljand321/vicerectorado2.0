const mongoose = require("../connect");
const Schema = require("mongoose").Schema;
var carrSchema = {
  nombre: String,
  id_f : String,
  facu :String
};
var carrera= mongoose.model("carrera", carrSchema);
module.exports = carrera;

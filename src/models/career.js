const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var carrSchema = {
  nombre: String,
  id_f: {type: Schema.ObjectId, ref: "faculty"}
};
var carrera= mongoose.model("carrera", carrSchema);
module.exports = carrera;

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//de la resolucion del estudiante
const estudetnSchema = Schema({
  numResolucion: String,
  numDictamen: String,
  tipo: String,
  pdf: Array,
  obs: String,
  id_a: {type: Schema.ObjectId, ref: "agrupare"},
  fecha: String
});

module.exports = mongoose.model('estudiantes', estudetnSchema);

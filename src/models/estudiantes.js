const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estudetnSchema = Schema({
  numResolucion: String,
  numDictamen: String,
  carrera: String,
  anio: Number,
  gestion: String,
  tipo: String,
  pdf: String,
  obs: String
});

module.exports = mongoose.model('estudiantes', estudetnSchema);

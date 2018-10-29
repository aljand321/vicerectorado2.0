const mongoose = require('nongoose');
const Schema = mongoose.Schemma;

const estudetnkSchema = Schema({
  numResolucion: String,
  numDictamen: String,
  carrera: String,
  anio: Number,
  gestion: String,
  tipo: String,
  pdf: String,
  obs: String
});

module.exports = mongoose.model('estudiantes', estudetnkSchema);

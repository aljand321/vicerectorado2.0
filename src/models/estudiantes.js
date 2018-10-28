const mongoose = require('nongoose');
const Schema = mongoose.Schemma;

const estudetnkSchema = Schema({
  numResolucion: String,
  numDictamen: String,
  gestion: String,
  año: Number,
  tipo: String,
  pdf: String
});

module.exports = mongoose.model('estudiantes', estudetnkSchema);

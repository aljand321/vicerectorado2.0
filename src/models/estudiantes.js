const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const estudetnSchema = Schema({
  numResolucion: String,
  numDictamen: String,
  pdf: Array,
  obs: String
});

module.exports = mongoose.model('estudiantes', estudetnSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const grupoDocSchema = Schema ({

  carrera: String,
  anio: Number,
  gestion: String

});

module.exports = omgoose.model('grupoDocente', grupoDocSchema);

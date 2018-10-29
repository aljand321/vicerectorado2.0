const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
  carrera: String,
  gestion : String,
  tipo: String
});
 module.exports =  mongoose.model('student', StudentSchema);

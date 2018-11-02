const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const StudentSchema = new Schema({
  nombre: String,
  apellido : String,
  pdf : Array,
  obs :String,
  id_ResEst: {type: Schema.ObjectId, ref: "estudiantes"}
});
 module.exports =  mongoose.model('student', StudentSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const TeacherSchema = new Schema({
  nombre: String,
  apellido : String,
  pdf : Array,
  obs :String,
  id_ResDoc: {type: Schema.ObjectId, ref: "docente"}
});
 module.exports =  mongoose.model('teacher', TeacherSchema);

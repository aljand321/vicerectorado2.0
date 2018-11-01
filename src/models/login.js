const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const loginSchema = new Schema ({

  nombres: String,
  apellidos:String,
  email: String,
  password: String,
  telefono: Number,
  ci: String

});

loginSchema.virtual("password_confirmation").get(function(){
  return this.p_c;

}).set(function(password){
  this.p_c = password;
});

module.exports = mongoose.model('login', loginSchema);

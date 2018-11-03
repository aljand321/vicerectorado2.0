const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const loginSchema = new Schema ({

  nombres: String,
  apellidos:String,
  email: String,
  password: {
   type:String,
    validate: {
      validator: function(p){
        return this.password_confirmation == p;
      },
      message: "Las contraceñas no son iguales"
    }
  }
});

loginSchema.virtual("password_confirmation").get(function(){
  return this.p_c;

}).set(function(password){
  this.p_c = password;
});

module.exports = mongoose.model('login', loginSchema);

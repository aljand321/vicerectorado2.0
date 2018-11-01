const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var userSchema = {
  nombre : String,
  email : String,
  password : String
};
var user = mongoose.model("user", userSchema);
module.exports = user;

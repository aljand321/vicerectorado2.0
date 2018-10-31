const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var facSchema = {
  nombre : String
};
var facultad = mongoose.model("facultad", facSchema);
module.exports = facultad;

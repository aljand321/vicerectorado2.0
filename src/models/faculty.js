const mongoose = require("../connect");
const Schema = require("mongoose").Schema;
var facSchema = {
  nombre : String
};
var facultad = mongoose.model("facultad", facSchema);
module.exports = facultad;

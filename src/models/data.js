const mongoose = require('mongoose');
const Schema = require("mongoose").Schema;
var dataSchema = {
  idData : String
};
var data= mongoose.model("data", dataSchema);
module.exports = data;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String,  },
  email: { type: String, },
  number: { type: String, },
  access: { type: String, },
  password: {type: String,},
  createBy: {type: String},
  createDate: {type: String},
  updateBy: {type: String,},
  updateDate: {type: String}
});

module.exports = mongoose.model("User", userSchema);
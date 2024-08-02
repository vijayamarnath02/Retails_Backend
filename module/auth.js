// models/User.js

const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdat: {
    type: Date,
    default: new Date(),
  },
  updateat: {
    type: Date,
    default: new Date(),
  },
});

// Create a model based on the schema
const User = mongoose.model("User", userSchema);

module.exports = User;

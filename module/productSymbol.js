const mongoose = require("mongoose");

// Define User schema
const userSchema = new mongoose.Schema({
  Name: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  symbol: { type: String, default: "" },
  status: {
    type: Number,
    default: 1,
  },
});
const User = mongoose.model("productsymbol", userSchema);

module.exports = User;

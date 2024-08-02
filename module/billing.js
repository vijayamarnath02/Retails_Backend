const mongoose = require("mongoose");
const Product = require("./productList");
const { ObjectId } = mongoose.Types;
const userSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  ProductId: {
    type: ObjectId,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  quanity: {
    type: Number,
    required: true,
  },
  ownerId: {
    type: ObjectId,
    required: true,
  },
  gst: {
    type: Boolean,
    required: true,
  },
  delivery: {
    type: Boolean,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  status: {
    type: Number,
    default: 1,
  },
});
const User = mongoose.model("billing", userSchema);

module.exports = User;

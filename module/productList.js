// models/Product.js

const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;

const productSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  Quantity: {
    type: Number,
    required: true,
  },
  productTypeid: {
    type: ObjectId,
    required: true,
  },
  productid: {
    type: String,
    required: true,
    unique: true,
  },
  pointer: {
    type: Boolean,
    required: true,
    default: false,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: ObjectId,
    required: true,
  },
  createAt: {
    type: Date,
    default: new Date(),
  },
  updateAt: {
    type: Date,
    default: new Date(),
  },

  status: {
    type: Number,
    default: 1,
  },
});
const Product = mongoose.model("Product", productSchema);

module.exports = Product;

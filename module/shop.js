const mongoose = require("mongoose");
const { ObjectId } = mongoose.Types;
const shopSchema = new mongoose.Schema({
  userId: {
    type: ObjectId,
    required: true,
  },

  shopName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gstNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}/.test(v);
      },
      message: (props) => `${props.value} is not a valid GST number!`,
    },
  },
  mobile: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /\d{10}/.test(v);
      },
      message: (props) => `${props.value} is not a valid mobile number!`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Simple email validation regex
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  name: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;

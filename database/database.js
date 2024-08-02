// db.js

const mongoose = require('mongoose');
const mongoURI = 'mongodb://localhost:27017/Retail'; // Replace with your MongoDB URI
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
module.exports = mongoose;

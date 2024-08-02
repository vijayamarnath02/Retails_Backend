// jwtUtils.js

const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');

// Secret key for JWT (replace with your own secret, preferably from environment variable)
const JWT_SECRET = 'javainuse-secret-key';

// Function to generate JWT token
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// Function to verify JWT token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}
function convertToObjectId(idString) {
  try {
    const objectId = new ObjectId(idString);
    return objectId;
  } catch (error) {
    throw new Error('Invalid ObjectId');
  }
}

module.exports = {
  generateToken,
  verifyToken,
  convertToObjectId
};

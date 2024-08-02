// middleware/tokenValidator.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = 'javainuse-secret-key'; // Import your secret key from config

function tokenValidator(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. Token is missing.' });
  }

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);

    req.decodedToken = decodedToken;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token.' });
  }
}

module.exports = tokenValidator;

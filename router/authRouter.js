// routes/authRoutes.js

const express = require("express");
const router = express.Router();
const User = require("../module/auth");

const jwtToken = require("../common/jwtToken");
const tokenValidator = require("../middle/tokenValidator");

router.post("/signup", (req, res) => {
  const { name, mobile, email, password } = req.body;
  User.findOne({ $or: [{ mobile }, { email }] })
    .then((existingUser) => {
      if (existingUser) {
        return res
          .status(400)
          .json({ error: "User already exists with this mobile or email" });
      }

      const newUser = new User({ name, mobile, email, password });
      newUser
        .save()
        .then(() => {
          var data = {
            name: newUser.name,
            mobile: newUser.mobile,
            email: newUser.email,
          };
          var token = jwtToken.generateToken(data);
          res.status(201).json({ message: token });
        })
        .catch((err) => {
          console.error("Error saving user:", err);
          res.status(500).json({ error: "Failed to register user" });
        });
    })
    .catch((err) => {
      console.error("Error finding user:", err);
      res.status(500).json({ error: "Server error" });
    });
});
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      if (password !== user.password) {
        // Replace with proper password hashing and comparison (e.g., bcrypt)
        return res.status(401).json({ error: "Incorrect password" });
      }
      const payload = {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
      };

      const token = jwtToken.generateToken(payload);

      res.status(200).json({ message: token });
    })
    .catch((err) => {
      console.error("Error logging in:", err);
      res.status(500).json({ error: "Server error" });
    });
});

module.exports = router;

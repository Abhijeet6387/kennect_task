const express = require("express");
const router = express.Router();
const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const CheckAuth = require("../utils/CheckAuth");

//Register Route
router.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, 10, (hash_err, hash) => {
    if (hash_err) {
      return res.status(500).json({ error: hash_err });
    } else {
      const newUser = new Users({
        ...req.body,
        password: hash,
      });
      Users.create(newUser, (err, newlyCreatedUser) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: err });
        } else {
          return res.status(201).json({
            message: "Registered Successfully",
            result: newlyCreatedUser,
          });
        }
      });
    }
  });
});

//Login Route
router.post("/login", (req, res) => {
  Users.find({ email: req.body.email }, (err, user) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err });
    } else {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authentication Failed",
        });
      }
      bcrypt.compare(
        req.body.password,
        user[0].password,
        (auth_err, result) => {
          if (auth_err) {
            return res.status(401).json({ message: "Authentication Failed" });
          } else if (result) {
            const token = jwt.sign(
              {
                id: user[0]._id,
                name: user[0].name,
                email: user[0].email,
              },
              process.env.SECRET_KEY,
              {
                expiresIn: "1h",
              }
            );
            return res
              .status(200)
              .json({ message: "Authentication Successful", token: token });
          } else {
            return res.status(401).json({
              message: "Failed to Fetch Token",
              token: null,
            });
          }
        }
      );
    }
  });
});

// getUserInfo
router.get("/getUserInfo", CheckAuth, (req, res) => {
  const token = req.headers.authorization;
  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const extractedToken = token.split(" ")[1];
  try {
    const decoded = jwt.verify(extractedToken, process.env.SECRET_KEY);
    const userId = decoded.id;
    Users.findById(userId, (err, user) => {
      if (err) {
        return res.status(500).json({ error: err, message: "Please Retry!" });
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const filterUser = {
        userId: user._id,
        name: user.name,
        email: user.email,
        contact: user.contact,
      };

      return res.status(200).json({
        message: "Successful",
        info: filterUser,
      });
    });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
});

module.exports = router;

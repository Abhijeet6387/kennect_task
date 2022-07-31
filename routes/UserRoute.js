const express = require("express");
const router = express.Router();
const Users = require("../models/UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require("../utils/checkAuth");

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
              "authsecretkey0101",
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

router.get("/getUserInfo", checkAuth, (req, res) => {
  Users.findById(req.userData.id, (err, user) => {
    if (err) {
      res.status(500).json({ error: err, message: "Please Retry!" });
    } else {
      const filterUser = {
        userId: user._id,
        name: user.name,
        email: user.emal,
        contact: user.contact,
      };
      return res.status(200).json({
        message: "Successful",
        info: filterUser,
      });
    }
  });
});

module.exports = router;

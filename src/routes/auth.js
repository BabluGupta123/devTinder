const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, gender } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      gender,
    });

    await user.save();
    res.status(201).send("User created successfully");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });
    if (!user) return res.status(400).send("Invalid credentials");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).send("Invalid credentials");

    const token = jwt.sign({ _id: user._id }, process.env.secretKey);

    res.cookie("token", token, { httpOnly: true });
    res.send("Login Successful!");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = { authRouter };

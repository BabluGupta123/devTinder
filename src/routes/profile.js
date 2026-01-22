const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const validator = require("validator");

const { userAuth } = require("../middlewares/auth");
const { validate } = require("../models/user");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Something went wrong! " + err.message);
  }
});

//Profile Edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedUser = req.user;
    const data = req.body;

    const allowedUpdates = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "skills",
      "about",
      "photoUrl",
    ];

    const isAllowed = Object.keys(data).every((key) =>
      allowedUpdates.includes(key),
    );

    if (!isAllowed) {
      return res.status(400).send("Update not allowed");
    }

    //  Update fields
    Object.keys(data).forEach((key) => {
      loggedUser[key] = data[key];
    });

    await loggedUser.save();

    res.status(200).json({
      message: "Profile updated successfully",
      data: loggedUser,
    });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

// Forget Password API
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { password } = await req.body;

    const isValid = validator.isStrongPassword(password);

    if (!isValid) {
      throw new Error("Enter Strong Password ! ");
    }

    const user = await req.user;

    if (!user) {
      throw new Error("Login Please! ");
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    user.password = hashedPassword;

    user.save();

    res.json({ message: "Password Updated Successfully ", data: user });
  } catch (error) {
    res.send("Something went wrong ," + error.message);
  }
});

module.exports = { profileRouter };

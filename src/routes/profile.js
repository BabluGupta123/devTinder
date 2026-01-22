const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;

    res.status(200).send(user);
  } catch (err) {
    res.status(500).send("Something went wrong! " + err.message);
  }
});

module.exports = { profileRouter };

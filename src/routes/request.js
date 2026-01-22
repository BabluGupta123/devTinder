const express = require("express");
const requestRoute = express.Router();

const { userAuth } = require("../middlewares/auth");

requestRoute.post("/connection", userAuth, async (req, res) => {
  try {
    const user = await req.user;
    if (!user) {
      res.status(404).send("Login Please! ");
    }
    res.status(200).send("Connection request sent by " + user.firstName);
  } catch (err) {
    res.send("Connection request Error: " + err.message);
  }
});

module.exports = { requestRoute };

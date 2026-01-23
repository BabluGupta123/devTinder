const express = require("express");
const userRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

userRoute.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", "firstName lastName");

    res.status(200).json({ message: "All requests! ", data: requests });
  } catch (error) {
    res.status(500).send("Error " + error.message);
  }
});

module.exports = { userRoute };

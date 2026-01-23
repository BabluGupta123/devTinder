const express = require("express");
const userRoute = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const safeData = "firstName lastName photoUrl age gender about skills";

userRoute.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const requests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", safeData);

    if (!requests) {
      return res.status(404).send("No request found ");
    }

    res.status(200).json({ message: "All requests! ", data: requests });
  } catch (error) {
    res.status(500).send("Error " + error.message);
  }
});
userRoute.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const data = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id, status: "accepted" },
        { toUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", safeData)
      .populate("toUserId", safeData);

    const connectionsData = data.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.send(connectionsData);
  } catch (err) {
    res.status(500).send("Something went wrong! " + err.message);
  }
});

module.exports = { userRoute };

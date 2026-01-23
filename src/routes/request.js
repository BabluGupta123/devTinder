const express = require("express");
const requestRoute = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRoute.post(
  "/connection/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const { toUserId, status } = req.params;

      // self request check
      if (fromUserId.toString() === toUserId) {
        return res.status(400).send("Try sending request to other users!");
      }

      // status validation
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      // check user exists
      const isUserExist = await User.findById(toUserId);
      if (!isUserExist) {
        return res.status(404).send("User does not exist!");
      }

      // check if connection request already exists (both directions)
      const isConnectionExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isConnectionExist) {
        return res.status(400).send("Request already sent!");
      }

      // create request
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await request.save();

      res.status(201).json({
        message: "Connection request sent! ",
        data: request,
      });
    } catch (err) {
      res.status(400).send("Connection request Error: " + err.message);
    }
  },
);

module.exports = { requestRoute };

const express = require("express");
const requestRoute = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const connectionRequest = require("../models/connectionRequest");

requestRoute.post(
  "/request/send/:status/:toUserId",
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
      const toUserData = await User.findById(toUserId);
      if (!toUserData) {
        return res.status(404).send("User does not exist!");
      }

      const toUserName = toUserData.firstName;
      const fromUserName = req.user.firstName;

      // check if connection request already exists (both directions)
      const isConnectionExist = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (isConnectionExist) {
        return res
          .status(400)
          .send(
            `${fromUserName + " you have already a request from " + toUserName + "!"}`,
          );
      }

      // create request
      const request = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      await request.save();

      res.status(201).json({
        message: `${fromUserName + " sent Connection request to " + toUserName + "!"}`,
        data: request,
      });
    } catch (err) {
      res.status(400).send("Connection request Error: " + err.message);
    }
  },
);

requestRoute.post(
  "/request/review/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const { status, toUserId } = req.params;
      const loggedInUserId = req.user._id;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status");
      }

      const requestData = await connectionRequest.findOne({
        fromUserId: toUserId,
        toUserId: loggedInUserId,
      });

      if (!requestData) {
        return res.status(400).send("Invalid Request! ");
      }

      if (requestData.status == "ignored") {
        return res
          .status(400)
          .send("The person you are trying to connect, is not Interested! ");
      } else if (
        requestData.status == "accepted" ||
        requestData.status == "rejected"
      ) {
        return res.status(400).send("You have already responded to this user!");
      }

      requestData.status = status;
      await requestData.save();

      res.status(200).json({
        message: "Status changed to " + status + " !",
        data: requestData,
      });
    } catch (error) {
      res.status(500).send("Something went wrong! " + error.message);
    }
  },
);

module.exports = { requestRoute };

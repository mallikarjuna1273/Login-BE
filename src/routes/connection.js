const express = require("express");

const Connection = require("../models/connection");
const userAuth = require("../middlewares/auth");

const User = require("../models/user");

const connectionRouter = express.Router();

const SAFE_DATA = "firstName gender interests about"

connectionRouter.post(
  "/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;

      const fromUserId = user[0]["_id"];

      const { status, toUserId } = req.params;

      const allowedStatus = ["interested", "ignored"];

      const isValidStatus = allowedStatus.includes(status);
      if (!isValidStatus) {
        throw new error("invalid status");
      }

      const isValidToUserId = await User.findOne({ _id: toUserId });

      if (!isValidToUserId) {
        throw new error("User Not found");
      }

      const connectionValid = await Connection.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (connectionValid) {
        return res.status(400).json({
          message: "connection request is already sent",
        });
      } else {
        const connectionRequest = new Connection({
          fromUserId,
          toUserId,
          status,
        });
        await connectionRequest.save();
        res.status(200).json({
          message: `${user[0]["firstName"]} is sent a connection request to ${isValidToUserId.firstName}`,
          data: connectionRequest,
        });
      }
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },
);

connectionRouter.post(
  "/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const fromUserId = user[0]["_id"];
      const { status, requestId } = req.params;

      const allowedStatus = ["accept", "reject"];

      const validStatus = allowedStatus.includes(status);

      if (!validStatus) {
        throw new Error("status is not valid");
      }

      const isRequestIdValid = await Connection.findById({ _id: requestId });

      if (!isRequestIdValid) {
        throw new Error("request is not found");
      }
      const connectionRequest = await Connection.findOne({
        fromUserId: isRequestIdValid.fromUserId.toString(),
        toUserId: fromUserId.toString(),
        status: "interested",
      })
      if (!connectionRequest) {
        throw new Error("Requests not found");
      }

      connectionRequest.status = status;

      await connectionRequest.save();

      res.status(200).json({
        message: `${user[0].firstName} + status `,
        data: connectionRequest,
      });
    } catch (err) {
      res.status(400).json({
        message: err.message,
      });
    }
  },
);

module.exports = connectionRouter;

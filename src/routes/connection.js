const express = require("express");

const Connection = require("../models/connection");
const userAuth = require("../middlewares/auth");

const User = require("../models/user");

const connectionRouter = express.Router();

connectionRouter.post(
  "/connection/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;

      const fromUserId = user[0]["_id"]
      console.log(user[0]["_id"], "from")


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
      }
      else{
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

module.exports = connectionRouter;

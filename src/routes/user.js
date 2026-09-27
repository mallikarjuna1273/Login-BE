const express = require("express");
const userAuth = require("../middlewares/auth");
const Connection = require("../models/connection");
const User = require("../models/user");

const userRouter = express.Router();

const SAFE_DATA = "firstName gender interests about";

// requests

userRouter.get("/user/requests", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const fromUserId = user[0]["_id"];

    const { firstName } = user[0];
    console.log(firstName);

    const connectionsRequests = await Connection.find({
      toUserId: fromUserId,
      status: "interested",
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);
    res.status(200).json({
      message: `${firstName} your Requests fetched successfully`,
      data: connectionsRequests,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// connections

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;

    const fromUserId = user[0]["_id"];

    const userConnections = await Connection.find({
      $or: [
        { fromUserId, status: "accept" },
        { toUserId: fromUserId, status: "accept" },
      ],
    })
      .populate("fromUserId", SAFE_DATA)
      .populate("toUserId", SAFE_DATA);

    res.status(200).json({
      message: `${user[0]["firstName"]} your connections fetched successfully`,
      data: userConnections,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// suggestions/feed

userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const fromUserId= user[0]["_id"];
    const hiddenUsers = await Connection.find({
      $or: [{ fromUserId: fromUserId }, { toUserId: fromUserId }],
    });

    const users = new Set();

    hiddenUsers.forEach((req) => {
       users.add(req.fromUserId.toString()), users.add(req.toUserId.toString());
    });

    console.log(users, "users")

    const connections = await User.find({
      // $and:[{$nin:[{_id:hiddenUsers}], $ni:[ {_id: fromUserId}]}]
      $and: [
        { _id: { $nin: Array.from(users) } },
        { _id: { $ne: fromUserId.toString() } },
      ],
    })

    // console.log(connections, "connectionss")

    res.status(200).json({
      message: "Connection suggestion fetched successfully",
      data: connections,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = userRouter;

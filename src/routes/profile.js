const express = require("express");
const profileRouter = express.Router();
const User = require("../models/user");
const userAuth = require("../middlewares/auth");

profileRouter.use(express.json());

//  user info
profileRouter.get("/user", userAuth, async (req, res) => {
  try {
    const user = req.user;
    //   console.log(userInfo)
    if (user.length === 0) {
      res.status(200).json({
        message: "User not found",
      });
    } else {
      res.status(200).json({
        message: "User Details fetched successfully",
        data: user,
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

// update user

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
  try {
    const userInfo = req.user[0];

    // const {firstName, emailId} = userInfo[0];
    console.log(userInfo)

    const allowedUpdates = ["firstName", "interests","gender","age"];

    const isValidUpdates = Object.keys(req.body).every((i) =>{
      return allowedUpdates.includes(i)
  });

    if (!isValidUpdates) {
      res.status(400).json({
        message: "updates are not allowed"
      });
    }


      Object.keys(req.body).forEach((key) => userInfo[key] = req.body[key])
    await userInfo.save();
    res.status(200).json({
      message: "Details are updated successfully",
      data: userInfo,
    });
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

//  delete user

profileRouter.delete("/user", async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.find({ _id: userId });
    if (user.length === 0) {
      res.status(200).json({
        message: "user not found",
      });
    } else {
      await User.findByIdAndDelete({ _id: userId });
      res.status(200).json({
        message: "user deleted successfully",
      });
    }
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong",
    });
  }
});

profileRouter.get('/users',userAuth, async(req, res)=>{
    try{
        const usersList = await User.find({})
        res.status(200).json({
            message:"userList fetched successfully",
            data: usersList
        })
    }
    catch(err){
        res.status(400).json({
            message: "Something went wrong"
        })
    }
})

module.exports = { profileRouter };

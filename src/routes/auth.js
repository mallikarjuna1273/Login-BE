const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const User = require('../models/user')

const authRouter = express.Router();

authRouter.post("/signUp", async (req, res) => {
  try {
    const { firstName, emailId, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({ firstName, emailId, password: hashPassword });
    await user.save();
    res.status(201).json({
      message: "Profile created successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// login

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    console.log(user, "user");
    if (!user) {
      res.status(400).json({ message: "Enter a valid credentials" });
    }
    console.log(user.password, "pwd");
    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
      res.status(400).json({ message: "Enter a valid credentials" });
    }
    const token = await jwt.sign({ _id: user._id }, "SECRET_KEY", {
      expiresIn: "1h",
    });

    res
      .cookie("token", token)
      .status(200)
      .json({
        message: `${user.firstName} you are loggedIn successfully`,
        data: user,
      });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// logout

authRouter.post('/logout', (req, res)=>{
    res.cookie('token', null, {expires: new Date(Date.now())}).status(200).json({
        message: "Logout successfully"
    })
})

module.exports = { authRouter };

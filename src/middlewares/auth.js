const jwt = require("jsonwebtoken");
const User = require('../models/user')
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    res.status(400).json({ message: "token is expired" });
  }
  const decodeMessage = await jwt.verify(token, "SECRET_KEY")

  const {_id} = decodeMessage;
  const user = await User.find({_id})
  if(!user){
    res.status(400).json({
        message:"user not found"
    })
  }
  req.user = user;
   next();
};

module.exports = userAuth;

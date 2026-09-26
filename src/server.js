const express = require("express");



const connectDB = require("./config/db");
const User = require("./models/user");
const { PORT } = require("./utils/constants");
const bcrypt = require('bcrypt')
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken')
const server = express();

server.use(express.json())
server.use(cookieParser())

// signup

server.post("/signUp", async (req, res) => {
  try {
    const {firstName, emailId, password} = req.body;
    const hashPassword = await bcrypt.hash(password, 10)
    const user = new User({firstName, emailId, password:hashPassword});
    await user.save();
    res.status(201).json({
        message:"Profile created successfully",
        data: user
    })
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

// login

 server.post('/login', async(req, res)=>{
    try{
       const {emailId, password} = req.body;

       const user = await User.findOne({emailId:emailId})
       console.log(user,"user")
       if(!user){
        res.status(400).json({message:"Enter a valid credentials"})
       }
       console.log(user.password,"pwd")
        const passwordCompare = await bcrypt.compare(password, user.password)

        if(!passwordCompare){
            res.status(400).json({message:"Enter a valid credentials"})
        }
      const token = await jwt.sign({_id:user._id}, "SECRET_KEY", {expiresIn:"1h"})

      res.cookie('token', token).status(200).json({
        message:`${user.firstName} you are loggedIn successfully`,
        data: user
      })
    }
    catch(err){
        res.status(400).json({
            message: err.message
        })
    }
 })



// feed api

server.get('/users', async(req, res)=>{
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

//  user info

server.get('/user', async(req, res)=>{
    try{
      const userId = req.body.userId;
      const userInfo = await User.find({_id:userId})
      console.log(userInfo)
      if(userInfo.length === 0) {
        res.status(200).json({
            message: "User not found"
        })
      }
      else{
        res.status(200).json({
        message:"User Details fetched successfully",
        data: userInfo
      })
      }

    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong"
        })
    }
})

//  delete user

server.delete('/user', async(req, res)=>{
    try{
    const userId = req.body.userId;
    const user = await User.find({_id:userId})
    if(user.length === 0){
        res.status(200).json({
            message:"user not found"
        })
    }else{
        await User.findByIdAndDelete({_id:userId})
        res.status(200).json({
            message:"user deleted successfully"
        })
    }
    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong"
        })
    }
})

//  update user by id


server.patch('/user', async(req, res)=>{
    try{
       const userId = req.body.userId;
       const userDetails = req.body;
    //    console.log(req.body)

       const user = await User.findByIdAndUpdate({_id:userId}, userDetails, {returnDocument: "after"})
       console.log(user,"user")
       await user.save()
       res.status(201).json({
        message:"Details are updated successfully",
        data:user
       })
    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong"
        })
    }
})

connectDB()
  .then(() => {
    console.log("DB Connection is Established...");
    server.listen(PORT, () => {
      console.log("server is running on " + PORT);
    });
  })
  .catch((err) => {
    console.log("DB Connection is not Established...");
  });

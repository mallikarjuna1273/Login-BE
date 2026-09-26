const express = require("express");
const profileRouter = express.Router();
const User = require('../models/user')


profileRouter.get('/users', async(req, res)=>{
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

profileRouter.get('/user', async(req, res)=>{
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

profileRouter.delete('/user', async(req, res)=>{
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


profileRouter.patch('/user', async(req, res)=>{
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

module.exports = { profileRouter };

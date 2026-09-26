# Login BackEnd api

# npm init -y => to create configuration file

# use NodeMon to restart server after every change

   package.json

      "scripts":{
        "start": "nodemon src/server.js"
    }

# npm i express => install express package to create server 

       here's the steps to create server

         by default we are using commonjs so we need to import like this only

        1. const express = require('express') 

         if we use ejs so we need to import like this only

        1. import express from 'express'

          create server using express

        2. const serverName = express();

        need to create a listener to listen the requests

        3. servername.listen(port,()=>{
            console.log("server is started on" + port)
        })

        if we want to export module in commonjs
        
        module.exports = {name Of The Variable or Function}

        if we want to export module in ejs

        export default function Name

# Request Handlers 

         it's just a function, if you want create a endpoint with specific method

         here's the HTTP methods
         get, post, update, patch, delete, etc...

      # Route handle to respond all requests

        serverName.use('/', (req, res)=>{
            res.status(200).json({
                message:"details fetched successfully"
            })
        })

        serverName.all('/', (req, res)=>{
            res.status(200).json({
                message:"details fetched successfully"
            })
        })

      # serverName.use() & serverName.all() both are similar but there's some differences are there

        serverName.use('/admin', (req, res)=>{
            res.status(200).json({
                message:"details fetched successfully"
            })
        });

        in this request if we add /admin/123 , it will give the proper response without any issue

        serverName.use('/admin', (req, res)=>{
            res.status(200).json({
                message:"details fetched successfully"
            })
        });

        in this request if we add /admin/123 , it will not the proper response and it will through cannot get/admin/123


# Important Note

    1. order of request handle matters, need to write in a proper order

    2. create separate file for all static values


# DB Connection

  need to create cluster in mongoDB website

  install mongoCompass and connect using cluster url (in url need to replace <db password> with original password of cluster)

  create a separate folder for config 

# Connect DB to server in our application

  need to install mongoose to connect DB

   src > config > db.js

   1. const mongoose = require('mongoose')
   
   2. const connectDB = async()=>{

       await mongoose.Connect("cluster URL")

    }

   3. .then(()=>{

       console.log("DB connection established")

   })
   .catch((err)=>{
    console.log("DB Connection is not Established...)
   })


# Need to connect DB first if DB is successfully established then need to run server

   1. Server Component

       const express =  require('express');

       const connectDB = require('/path of connectDB in config')

       const server = express();

       server.get('/', (req, res)=>{
        try{
            res.status(200).json({
                message: "Data fetched Successfully
            })
        }
       })

  connectDB().then(()=>{
    server.listen(port, ()=>{
        console.log("server is running on" + port)
    })
  })
  .catch((err)=>{
    console.log("DB is not Established....)
  })



# Schema Creation

    we are using mongoose to create schema ( schema => it restrict the field that should be specific type)

 src > models > user.js

  1. const mongoose = require('mongoose) 

  2. const userSchema = new mongoose.Schema({

   <!-- CamelCase is best approach to write parameters -->

     firstName:{
        type: String
     },
     lastName:{
        type:String
     },
     emailId:{
        type: String
     },
     password:{
        type: String
     },
     gender:{
        type: String
     },
     photoUrl:{
        type: String
     },
     age:{
        type: Number
     },
     mobile:{
        type: Number
     }
  })

 3. module.exports = mongoose.model("User", userSchema);


# Create new user using schema and store in Collection in Cluster

1. const User = require('path of the user model')

2. const bcrypt = require('bcrypt'); (it'll encrypt password)

3. serverName.post('/signUp', async(req, res)=>{
     try{
      <!-- const userData= {
        firstName:"Nageswara Rao Velama",
        emailId:"nageswar@gmail.com",
        password:"Nageswar@1273"
      } -->
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      const user = new User({firstName, emailId, password: passwordHash, about, gender, photoUrl,interests}) 
      await user.save();
      res.status(201).json({
        message:"profile created successfully",
        data: user
      })
     }
     catch(err){
      res.status(400).json({
        message:"Something went Wrong"
      })
     }
})


# Feed api to get all created account information
 
  => to read json data , need to add express.json()

  1. serverName.use(express.json()) ; it will convert json into js
 
  2. serverName.get('/users', async(req, res)=>{
    try{
        const usersList = User.find({})
        res.status(200).json({
            message :"UserDetails fetched successfully",
            data:usersList
        })
    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong"
        })
    }
  })

# get specific user info

  1. serverName.get('/user', async(req, res)=>{
    try{
        const userId= req.body.userId;
        const user = await User.find({_id:userId})
        res.status(200).json({
            message:"user details fetched successfully",
            data: user
        })
    }
    catch(err){
        res.status(400).json({
            message: "Something went wrong"
        })
    }
  })

# delete user by userId

 1. serverName.delete('/user', async(req, res)=>{
    try{
        const userId= req.body.userId;
        const user = await user.findIdAndDelete(userId)
        res.status(200).json({
            message:"user deleted successfully"
        }) 
    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong"
        })
    }
 })


# update user info by userId

 1. serverName.patch('/user', async(req, res)=>{
    try{
        const userId = req.body.userId;

        const details = req.body;

        const user = await User.findByIdAndUpdate(userId, {req.body})
        await user.save()

        res.status(201).json({
            message:"user details updated successfully"
        })
    }
    catch(err){
        res.status(400).json({
            message:"Something went wrong"
        })
    }
 })


# Login api

   1. first need to check validations 
   2. email is valid or not
   3. password is correct or not
   4. if both email and password are correct, send a jwt token to cookie

   # required packages to protect password bcrypt

     1. const bcrypt = require("bcrypt")
     2. const jwt = require('jsonwebtoken)
     3. const cookieParser = require('cookie-parser') => (to read cookie)
     3. serverName.use(cookieParser())
     3. serverName.post('/login', async(req, res)=>{
        const {emailId, password} = req.body;
        const user= await User.find({emailId:emailId})
        if(user.length === 0){
            throw new error("invalid credentials")
        }
        else{
            const passwordCompare =await bcrypt.compare(password, user.password)
            if(!passwordCompare){
                throw new Error("invalid credentials")
            }

           const token = await jwt.sign({_id:user._id}, "SECRET_KEY", {expiresIn:"1d"})

            res.cookie('token', token).status(200).json({
                message:`{user.firstName} you are logged in successfully`,
                data: user
            })
        }
     })


# logout api

   1. serverName.post('/logout', (req, res)=>{
    res.cookie('token', null, {expires: new Date(Date.now())}).status(200).json({
        message:"Logout successfully"
    })
   })

# need to add validations to restrict to user 

# encrypt password (bcrypt)

# jwt token for authentication

# auth middleware 

# schema.models to offload functionalities


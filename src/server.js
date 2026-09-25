const express = require("express");

const connectDB = require("./config/db");
const User = require("./models/user");
const { PORT } = require("./utils/constants");

const server = express();

server.post("/signUp", async (req, res) => {
  try {
    const userData = {
      firstName: "Nageswara Rao Velama",
      emailId: "nageswar@gmail.com",
      password: "Nageswara@1273",
    };
    const user = new User(userData);
    await user.save();
    res.status(201).json({
        message:"Profile created successfully",
        data: user
    })
  } catch (err) {
    res.status(400).json({
      message: "Something went wrong ...",
    });
  }
});

// server.all('/test', (req, res)=>{
//     res.end("hiii i'm from test")
// })
// server.use('/hello', (req, res)=>{
//     res.end("hiii i'm from helloo")
// })
// server.use('/hii', (req, res)=>{
//     res.end("hiii i'm from hii")
// })
// server.use('/', (req, res)=>{
//     res.end("route is mismatched")
// })

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

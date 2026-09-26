const express = require("express");

const connectDB = require("./config/db");
const User = require("./models/user");
const { PORT } = require("./utils/constants");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const server = express();

const { authRouter } = require("./routes/auth");
const { profileRouter } = require("./routes/profile");
const connectionRouter = require("./routes/connection");

server.use(express.json());
server.use(cookieParser());

server.use("/", authRouter);
server.use("/", profileRouter);
server.use('/', connectionRouter)

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

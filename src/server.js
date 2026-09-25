const express = require('express');

const connectDB= require('./config/db')
const { PORT } = require('./utils/constants');


const server= express();

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

connectDB().then(()=>{
    console.log("DB Connection is Established...");
    server.listen(PORT,()=>{
    console.log("server is running on " + PORT)
})
})
.catch((err)=>{
    console.log("DB Connection is not Established...")
})

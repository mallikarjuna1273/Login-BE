const mongoose = require('mongoose')
const { CLUSTER_URL } = require('../utils/constants')

const connectDB = async()=>{
    await mongoose.connect(CLUSTER_URL)
}

module.exports = connectDB;
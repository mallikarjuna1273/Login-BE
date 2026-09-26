const mongoose = require('mongoose')

const connectionSchema= new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status:{
        type: String,
        required: true,
        enum:{
            values:["interested","ignored","accepted","rejected"],
            message:`{VALUE} is not valid status`
        }
    }
},{timestamps:true})

connectionSchema.index({fromUserId:1, toUserId:1})

connectionSchema.pre('save', function(req, res, next){
  const  Connection = this
    if(Connection.fromUserId.equals(Connection.toUserId)){
         throw new Error("Connection request is not valid")
    }
    next;
})


module.exports = mongoose.model("Connection",connectionSchema)
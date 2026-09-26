const mongoose = require('mongoose');

const validator = require('validator')

const userSchema = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:[4, "FirstName must be greater than 4 characters"],
        maxLength:[50, "FirstName must be less than 50 characters"]
    },
    emailId:{
        type:String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
        validate(value){
        if(!(validator.isEmail(value))){
            throw new Error("Enter a valid email address")
        }
        }
    },
    password:{
        type: String,
        required: true,
        validate(value){
            if(!(validator.isStrongPassword(value))){
                throw new Error("Enter a strong password")
            }
        }
    },
    photoUrl:{
        type: String,
        default:"https://thumbs.dreamstime.com/b/user-icon-trendy-flat-style-isolated-grey-background-user-silhouette-symbol-your-web-site-design-logo-app-ui-vector-168517311.jpg",
        validate(value){
            if(!(validator.isURL(value))){
                throw new Error("Enter a valid url")
            }
        }
    },
    about:{
        type: String,
        default:"hey i'm using this app",
        maxLength:[500, "About must be less than 500 characters"]
    },
    gender:{
        type: String,
        validate(value){
            if(!(["male","female","others"].includes(value))){
                throw new Error ("Entered gender is not listed")
            }
        }
    },
    interests:{
        type:[String],
        maxLength:[10, "Interests must be less than 10 only"]
    }
}, {timestamps: true})

module.exports = mongoose.model("User", userSchema)
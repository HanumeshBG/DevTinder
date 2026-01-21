const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');   


const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
        index: true
    },
    lastName : {
        type: String
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email address');
            }
        }
    },
    password : {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error('Enter Strong Password');
            }
        }
    },
    age : {
        type: Number,
        min: 18,
    },
    gender : {
        type: String,
        validate(value) {
            if (!['male', 'female', 'other'].includes(value)) {
                throw new Error('Invalid gender');
            }
        }
    },
    photoUrl : {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/149/149093.png"
    },
    skills : {
        type: [String]
    },
    about : {
        type: String,
        maxlength: 500,
        default: "This is about me section."
    }
}, { timestamps: true });

userSchema.methods.getToken = async function() {
    const user = this;
    const token = await jwt.sign({_id: user._id}, "Hanumesh@DevTinder123", {
        expiresIn: '7d'
    });
    return token;
}

userSchema.methods.isPasswordMatch = async function(passwordByUser){
    const user = this;
    return await bcrypt.compare(passwordByUser, user.password)
}

module.exports = mongoose.model("User", userSchema);
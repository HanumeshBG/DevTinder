const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName : {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30
    },
    lastName : {
        type: String
    },
    email : {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password : {
        type: String,
        required: true,
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
    skills : {
        type: [String]
    },
    about : {
        type: String,
        maxlength: 500,
        default: "This is about me section."
    }
}, { timestamps: true });

module.exports = mongoose.model("user", userSchema);
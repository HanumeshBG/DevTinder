const { text } = require('express');
const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    text:{
        type: String,
        required: true
    }
}, { timestamps: true })

const chatSchema = new mongoose.Schema({
    participents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }],
    messages: [messageSchema]
})

module.exports = mongoose.model("Chat", chatSchema);
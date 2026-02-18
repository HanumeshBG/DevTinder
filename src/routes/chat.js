const express = require('express');
const chatRoutes = express.Router();
const { userAuth } = require('../middlewares/auth');
const Chat = require('../models/chat');

chatRoutes.get("/:targetUserId", userAuth, async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const targetUserId = req.params.targetUserId;

        let chat = await Chat.findOne({
            participents: {$all: [loggedInUserId, targetUserId]}
        }).populate({
                path: "messages.senderId",
                select: "firstName lastName"
            }
        )
        if(!chat){
            chat = new Chat({
                participents: [loggedInUserId, targetUserId],
                messages: []
            })
            await chat.save()
        }
        res.status(200).json(chat);

    } catch (err){
        res.status(400).send("ERROR : "+ err.message);
    }
})

module.exports = chatRoutes;
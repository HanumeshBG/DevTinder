const express = require('express');
const requestRoutes = express.Router();
const { userAuth } = require('../middlewares/auth');

const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');
const connectionRequest = require('../models/connectionRequest');

const sendEmail = require("../utils/sendEmail")

const ALLOWED_DATA = "firstName lastName email age gender skills about" // or ['firstName', 'lastName', 'email', 'age', 'gender', 'skills', 'about']

requestRoutes.post("/send/:status/:toUserId", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        // Check if toUserId exists
        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User does not exist");
        }

        const ALLOWED_STATUSES = ["ignored", "interested"];
        if(!ALLOWED_STATUSES.includes(status)){
            throw new Error("Invalid status " + status);
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId}
            ],
        })

        if(existingConnectionRequest){
            throw new Error("Connection request already exists between these users");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status: status
        });
        const data = await connectionRequest.save();

        const emailResponse = await sendEmail.run();

        res.status(200).json({ message: "Connection request sent successfully", data });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

requestRoutes.post("/review/:status/:requestedId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { requestedId, status } = req.params;

        const ALLOWED_STATUSES = ["accepted", "rejected"];
        if(!ALLOWED_STATUSES.includes(status)){
            return res.status(400).json({ message: "Invalid status " + status });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestedId,
            toUserId: loggedInUser._id,
            status: "interested"
        })
        if(!connectionRequest){
            return res.status(400).json({ message: "Connection request not found" });
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.status(200).json({ message: "Connection request " + status + " successfully", data });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = requestRoutes;
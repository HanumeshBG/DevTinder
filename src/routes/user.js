const express = require("express");
const userRoutes = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const ALLOWED_SAFE_DATA = "firstName lastName email age gender skills about" // or ['firstName', 'lastName', 'email', 'age', 'gender', 'skills', 'about']


userRoutes.get("/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
            status: "interested"
        }).populate('fromUserId', ALLOWED_SAFE_DATA)
        .populate("toUserId", ALLOWED_SAFE_DATA);

        res.json({
            message: "Connection requests fetched successfully",
            data: connectionRequests
        })
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

userRoutes.get("/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ],
            status: "accepted"
        }).populate('fromUserId', ALLOWED_SAFE_DATA)
        .populate("toUserId", ALLOWED_SAFE_DATA);

        const data = connectionRequests.map(request => {
            if(request.fromUserId._id.equals(loggedInUser._id)){
                return request.toUserId;
            }
            return request.fromUserId;
        })

        res.json({ data });
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
})

userRoutes.get("/feeds", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page - 1) * limit;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                {fromUserId: loggedInUser._id},
                {toUserId: loggedInUser._id}
            ]
        }).select("fromUserId toUserId");

        let hideUsers = new Set()
        connectionRequests.forEach(req => {
            hideUsers.add(req.fromUserId.toString());
            hideUsers.add(req.toUserId.toString());
        })

        const feeds = await User.find({
            $and: [
                {_id: { $nin: Array.from(hideUsers) }},
                {_id: { $ne: loggedInUser._id }}
            ]
        })
        .select(ALLOWED_SAFE_DATA)
        .skip(skip)
        .limit(limit);

        res.json({ data: feeds });
    } catch (err){
        res.status(400).send("ERROR : " + err.message);
    }
})

module.exports = userRoutes;
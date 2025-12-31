const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validate } = require('../models/user');
const profileRoutes = express.Router();
const { validateProfileData } = require('../utils/validations');
const bycrpt = require('bcrypt');
const validator = require('validator');


profileRoutes.get("/view", userAuth, async (req, res) => {
    try{
        res.status(200).json(req.user);
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

profileRoutes.patch("/edit", userAuth, async (req, res) => {
    try{
        if(!validateProfileData(req)){
            throw new Error("Invalid profile data");
        }

        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });

        await loggedInUser.save();
        res.status(200).json({ message: "Profile updated successfully", data: loggedInUser });
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

profileRoutes.patch("/editPassword", userAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const loggedInUser = req.user;

        const isPasswordMatch = await loggedInUser.isPasswordMatch(oldPassword);
        if(!isPasswordMatch){
            throw new Error("Old password is incorrect");
        }

        if(!validator.isStrongPassword(newPassword)){
            throw new Error("New password is not strong enough");
        }

        const newHashedPassword = await bycrpt.hash(newPassword, 10);
        loggedInUser.password = newHashedPassword;
        await loggedInUser.save();
        res.status(200).send("Password updated successfully");
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

module.exports = profileRoutes;
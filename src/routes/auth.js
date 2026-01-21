const express = require('express');
const { validateSignupData } = require('../utils/validations');
const User = require('../models/user');
const validator = require('validator');
const bcrypt = require('bcrypt');
const authRoutes = express.Router();

authRoutes.post("/signup", async (req, res) => {
    try {
        // Validate signup data
        validateSignupData(req);

        const {firstName, lastName, email, password, age, gender} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
    
        // Signup logic here
        const user = new User({firstName, lastName, email, password: passwordHash, age, gender});
        const savedUser = await user.save();

        const token = await savedUser.getToken();
        res.cookie("token", token, {
            expires: new Date(Date.now() + 7*3600000),
        })
        res.status(200).json({message: "User signed up successfully", data: savedUser });
    } catch (err) {
        res.status(400).send("Error signing up user: "+ err.message);
    }
})

authRoutes.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!validator.isEmail(email)){
            throw new Error("Invalid email address");
        }

        const user = await User.findOne({ email: email });
        if (!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordMatch = await user.isPasswordMatch(password);
        if(!isPasswordMatch){
            throw new Error("Invalid credentials");
        } else {
            const token = await user.getToken();
            res.cookie("token", token, {
                expires: new Date(Date.now() + 7*3600000),
            })
            res.status(200).send(user);
        }

    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

authRoutes.post("/logout", async (req, res) => {
    try {
        res.cookie("token", null, {
            expires: new Date(Date.now()),
        })
        res.status(200).send("User logged out successfully");
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

module.exports = authRoutes;
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
    try {
        const { token }= req.cookies;
        if(!token){
            return res.status(401).send("Authentication required");
        }
    
        const decodedMessage = jwt.verify(token, "Hanumesh@DevTinder123");
        const user = await User.findById(decodedMessage._id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next()
    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
}

module.exports = {
    userAuth
}
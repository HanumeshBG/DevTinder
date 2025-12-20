const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const { validateSignupData } = require('./utils/validations');
const bcrypt = require('bcrypt');
const validator = require('validator');

const app = express();

// Used to parse JSON bodies
app.use(express.json());

app.post("/signup", async (req, res) => {
    try {
        // Validate signup data
        validateSignupData(req);

        const {firstName, lastName, email, password, age, gender} = req.body;
        const passwordHash = await bcrypt.hash(password, 10);
    
        // Signup logic here
        const user = new User({firstName, lastName, email, password: passwordHash, age, gender});
        await user.save();
        res.status(200).send("User signed up successfully");
    } catch (err) {
        res.status(400).send("Error signing up user: "+ err.message);
    }
})

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!validator.isEmail(email)){
            throw new Error("Invalid email address");
        }

        const user = await User.findOne({ email: email });
        if (!user){
            throw new Error("Invalid credentials");
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            throw new Error("Invalid credentials");
        } else {
            res.status(200).send("User logged in successfully");
        }

    } catch (err) {
        res.status(400).send("ERROR : "+ err.message);
    }
})

app.get("/users", async (req, res) => {
    const emailToFind = req.body.email;

    try{
        const users = await User.findOne({ email: emailToFind });
        if(users.length === 0) {
            res.status(404).send("No users found with the given email");
        } else {
            res.status(200).json(users);
        }
    } catch (err) {
        res.status(400).send("Error getting user: " + err.message);
    }
})

app.delete("/user", async (req, res) => {
    const userID = req.body.userID;

    try {
        const user = await User.findByIdAndDelete(userID);
        if (!user) {
            res.status(404).send("No user found with the given email");
        } else {
            res.status(200).send("User deleted successfully");
        }
    } catch (err) {
        res.status(400).send("Error on deleting user: " + err.message);
    }
})

app.patch("/user/:userID", async (req, res) => {
    const userID = req.params?.userID;

    const ALLOWED_UPDATES = ['password', 'age', 'gender', 'skills', 'about'];

    const isUpdateValid = Object.keys(req.body).every((update) => 
        ALLOWED_UPDATES.includes(update)
    );

    if(!isUpdateValid) {
        res.status(400).send("Invalid updates!");
    }

    if(req.body.skills.length > 10) {
        res.status(400).send("Skills cannot exceed 10");
    }

    try {
        const user = await User.findByIdAndUpdate(userID, req.body, { 
            returnDocument:'after',
            runValidators: true
        });
        if (!user) {
            res.status(404).send("No user found");
        } else {
            res.status(200).json(user);
        }
    } catch (err) {
        res.status(400).send("Error on updating user: " + err.message);
    }
})


connectDB().then(() => {
    console.log('Database connected successfully');
    app.listen(3000, () => {
        console.log('Server is running on port 3000');
    })
}).catch((err) => {
    console.error('Database connection failed:', err);
});
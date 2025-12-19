const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

// Used to parse JSON bodies
app.use(express.json());

app.post("/signup", async (req, res) => {
    // Signup logic here
    const user = new User(req.body)

    try {
        await user.save();
        res.status(200).send("User signed up successfully");
    } catch (err) {
        res.status(400).send("Error signing up user");
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
        res.status(400).send("Error signing up user" + err);
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
        res.status(400).send("Error signing up user");
    }
})

app.patch("/user", async (req, res) => {
    const userID = req.body.userID;
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
        res.status(400).send("Error signing up user");
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
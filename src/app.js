const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const http = require('http');
const initializeSocket = require('./utils/socket');

require('dotenv').config();

// require('./utils/cornjob'); //uncomment to enable cornjob

const app = express();

// Used to parse JSON bodies
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const requestRoutes = require('./routes/request');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');

app.use("/", authRoutes);
app.use("/profile", profileRoutes);
app.use("/request", requestRoutes);
app.use("/user", userRoutes);
app.use("/chat", chatRoutes);

const server = http.createServer(app);
initializeSocket(server);
// app.get("/users", async (req, res) => {
//     const emailToFind = req.body.email;

//     try{
//         const users = await User.findOne({ email: emailToFind });
//         if(users.length === 0) {
//             res.status(404).send("No users found with the given email");
//         } else {
//             res.status(200).json(users);
//         }
//     } catch (err) {
//         res.status(400).send("Error getting user: " + err.message);
//     }
// })

// app.delete("/user", async (req, res) => {
//     const userID = req.body.userID;

//     try {
//         const user = await User.findByIdAndDelete(userID);
//         if (!user) {
//             res.status(404).send("No user found with the given email");
//         } else {
//             res.status(200).send("User deleted successfully");
//         }
//     } catch (err) {
//         res.status(400).send("Error on deleting user: " + err.message);
//     }
// })

// app.patch("/user/:userID", async (req, res) => {
//     const userID = req.params?.userID;

//     const ALLOWED_UPDATES = ['password', 'age', 'gender', 'skills', 'about'];

//     const isUpdateValid = Object.keys(req.body).every((update) => 
//         ALLOWED_UPDATES.includes(update)
//     );

//     if(!isUpdateValid) {
//         res.status(400).send("Invalid updates!");
//     }

//     if(req.body.skills.length > 10) {
//         res.status(400).send("Skills cannot exceed 10");
//     }

//     try {
//         const user = await User.findByIdAndUpdate(userID, req.body, { 
//             returnDocument:'after',
//             runValidators: true
//         });
//         if (!user) {
//             res.status(404).send("No user found");
//         } else {
//             res.status(200).json(user);
//         }
//     } catch (err) {
//         res.status(400).send("Error on updating user: " + err.message);
//     }
// })

connectDB().then(() => {
    console.log('Database connected successfully');
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    })
}).catch((err) => {
    console.error('Database connection failed:', err);
});
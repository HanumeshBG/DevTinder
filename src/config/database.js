const mongoose = require('mongoose');
const dbURI = 'mongodb+srv://hanumesh:Hanumeshbg@learnnode.ggsd3af.mongodb.net/DevTinder';

const connectDB = async () => {
    await mongoose.connect(dbURI)
}

module.exports = connectDB;
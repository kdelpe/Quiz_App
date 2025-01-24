const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    date: String,
    score: Number,
    rank: String
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    stats: [statSchema]
});

module.exports = mongoose.model('User', userSchema); 
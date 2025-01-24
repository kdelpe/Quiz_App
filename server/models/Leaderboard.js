const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
    user: { type: String, required: true },
    score: { type: String, required: true },
    rank: { type: String, required: true },
    stats: [{
        date: String,
        score: String,
        rank: String
    }]
});

module.exports = mongoose.model('Leaderboard', leaderboardSchema); 
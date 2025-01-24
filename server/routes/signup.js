const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Create new user
        const user = new User({ username, email, password });
        await user.save();
        
        // Create initial leaderboard entry
        const leaderboardCount = await Leaderboard.countDocuments();
        const leaderboardEntry = new Leaderboard({
            rank: (leaderboardCount + 1).toString(),
            user: username,
            score: "0"
        });
        await leaderboardEntry.save();
        
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/html/signup.html'));
});

module.exports = router;
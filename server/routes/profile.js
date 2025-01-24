const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/User');

router.use(express.json());

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/html/profile.html'));
});

router.get('/data', async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(401).json({ error: 'Unauthorized: Please log in.' });
        }

        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Ensure stats array exists
        if (!user.stats) {
            user.stats = [];
            await user.save();
        }

        res.json({ username: user.username, stats: user.stats });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

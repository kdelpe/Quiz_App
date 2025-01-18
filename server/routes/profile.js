const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const userDBPath = path.join(__dirname, '../data/userDB.json');
const leaderboardDBPath = path.join(__dirname, '../data/leaderboardDB.json');

router.get('/', (req, res) => {
    const username = req.session?.username; // Retrieve username from session
    if (!username) {
        return res.status(401).json({ error: 'Unauthorized: Please log in.' });
    }

    // Read both userDB and leaderboardDB
    try {
        const userDB = JSON.parse(fs.readFileSync(userDBPath, 'utf-8'));
        const leaderboardDB = JSON.parse(fs.readFileSync(leaderboardDBPath, 'utf-8'));

        // Find user in userDB
        const user = userDB.users.find(u => u.username === username);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Filter leaderboard entries for the current user
        const userStats = leaderboardDB.leaderboard.filter(entry => entry.user === username);

        // Return profile data
        res.json({
            username: user.username,
            email: user.email,
            stats: userStats,
        });
    } catch (err) {
        console.error('Error reading database files:', err);
        res.status(500).json({ error: 'Failed to load profile data.' });
    }
});

module.exports = router;

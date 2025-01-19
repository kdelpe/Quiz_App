const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.use(express.json());

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/html/leaderboard.html'));
});

router.post('/update-score', async (req, res) => {
    try {
        const { username, score } = req.body;

        if (!username || !score) {
            return res.status(400).json({ error: 'Username and score are required' });
        }

        const userDBPath = path.join(__dirname, '../../data/userDB.json');
        const leaderboardPath = path.join(__dirname, '../../data/leaderboardDB.json');

        // Load userDB
        const userDBData = await fs.readFile(userDBPath, 'utf8');
        const userDB = JSON.parse(userDBData);

        // Load leaderboard
        const leaderboardData = await fs.readFile(leaderboardPath, 'utf8');
        const leaderboardDB = JSON.parse(leaderboardData);

        const now = new Date();
        const date = now.toISOString().split('T')[0];

        // Update user stats
        let user = userDB.users.find(user => user.username === username);
        if (!user) {
            // Create new user if not exists
            user = { username, email: '', password: '', stats: [] }; // Add email/password if necessary
            userDB.users.push(user);
        }

        // Add new stat
        user.stats.push({ date, score: parseInt(score), rank: null });

        // Update leaderboard
        let userInLeaderboard = leaderboardDB.leaderboard.find(entry => entry.user === username);

        if (userInLeaderboard) {
            if (parseInt(score) > parseInt(userInLeaderboard.score)) {
                userInLeaderboard.score = score.toString();
            }
        } else {
            leaderboardDB.leaderboard.push({
                rank: leaderboardDB.leaderboard.length + 1,
                user: username,
                score: score.toString()
            });
        }

        // Recalculate leaderboard ranks
        leaderboardDB.leaderboard.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        leaderboardDB.leaderboard.forEach((entry, index) => {
            entry.rank = [index + 1].toString();
        });

        const updatedRank = leaderboardDB.leaderboard.find(entry => entry.user === username)?.rank;
        user.stats.push({ date, score: parseInt(score), rank: updatedRank });

        // Save updated files
        await fs.writeFile(userDBPath, JSON.stringify(userDB, null, 4));
        await fs.writeFile(leaderboardPath, JSON.stringify(leaderboardDB, null, 4));

        res.json({ message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
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
        
        const leaderboardPath = path.join(__dirname, '../../data/leaderboardDB.json');
        const data = await fs.readFile(leaderboardPath, 'utf8');
        const leaderboardDB = JSON.parse(data);
        
        // Check if user already exists. Otherwise add new entry
        const existingEntry = leaderboardDB.leaderboard.find(entry => entry.user === username);
        
        if (existingEntry) {
            if (parseInt(score) > parseInt(existingEntry.score)) {
                existingEntry.score = score.toString();
            }
        } else {
            leaderboardDB.leaderboard.push({
                rank: (leaderboardDB.leaderboard.length + 1).toString(),
                user: username,
                score: score.toString()
            });
        }
        
        leaderboardDB.leaderboard.sort((a, b) => parseInt(b.score) - parseInt(a.score));
        leaderboardDB.leaderboard.forEach((entry, index) => {
            entry.rank = (index + 1).toString();
        });
        
        // updated leaderboard
        await fs.writeFile(leaderboardPath, JSON.stringify(leaderboardDB, null, 4));
        
        res.json({ message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');

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

        // Update or create user's leaderboard entry
        let leaderboardEntry = await Leaderboard.findOne({ user: username });
        const currentScore = parseInt(score);

        if (leaderboardEntry) {
            if (currentScore > parseInt(leaderboardEntry.score)) {
                leaderboardEntry.score = score.toString();
                await leaderboardEntry.save();
            }
        } else {
            const count = await Leaderboard.countDocuments();
            leaderboardEntry = new Leaderboard({
                rank: (count + 1).toString(),
                user: username,
                score: score.toString()
            });
            await leaderboardEntry.save();
        }

        // Update all ranks
        const allEntries = await Leaderboard.find().sort({ score: -1 });
        for (let i = 0; i < allEntries.length; i++) {
            allEntries[i].rank = (i + 1).toString();
            await allEntries[i].save();
        }

        // Update user stats
        const user = await User.findOne({ username });
        if (user) {
            const now = new Date();
            const date = now.toISOString().split('T')[0];
            const updatedRank = (await Leaderboard.findOne({ user: username }))?.rank;

            if (!user.stats) {
                user.stats = [];
            }
            
            user.stats.push({
                date,
                score: currentScore,
                rank: updatedRank
            });
            
            await user.save();
        }

        res.json({ message: 'Score updated successfully' });
    } catch (error) {
        console.error('Error updating score:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
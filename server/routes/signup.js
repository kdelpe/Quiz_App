const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        const userDBPath = path.join(__dirname, '../../data/userDB.json');
        const data = await fs.readFile(userDBPath, 'utf8');
        const userDB = JSON.parse(data);
        
        // Check if user already exists
        if (userDB.users.some(user => user.email === email)) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        userDB.users.push({ username, email, password });
        
        await fs.writeFile(userDBPath, JSON.stringify(userDB, null, 4));
        
        // Create initial leaderboard entry with score 0
        const leaderboardPath = path.join(__dirname, '../../data/leaderboardDB.json');
        const leaderboardData = await fs.readFile(leaderboardPath, 'utf8');
        const leaderboardDB = JSON.parse(leaderboardData);
        
        leaderboardDB.leaderboard.push({
            rank: (leaderboardDB.leaderboard.length + 1).toString(),
            user: username,
            score: "0"
        });
        
        // Save updated leaderboard
        await fs.writeFile(leaderboardPath, JSON.stringify(leaderboardDB, null, 4));
        
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
const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// parse JSON bodies
router.use(express.json());

// POST for user login
router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Read users data
        const userDBPath = path.join(__dirname, '../../data/userDB.json');
        const data = await fs.readFile(userDBPath, 'utf8');
        const userDB = JSON.parse(data);
        
        // Find user and verify password
        const user = userDB.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            res.json({ 
                success: true,
                user: {
                    username: user.username,
                    email: user.email
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET to serve login page
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/html/login.html'));
});

module.exports = router;
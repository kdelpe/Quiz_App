const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const userDBPath = path.join(__dirname, '../../data/userDB.json');
        const data = await fs.readFile(userDBPath, 'utf8');
        const userDB = JSON.parse(data);
        
        // Verify user password
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

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/html/login.html'));
});

module.exports = router;
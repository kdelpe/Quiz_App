const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/User');

router.use(express.json());

router.post('/', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Find user in MongoDB
        const user = await User.findOne({ username, password });
        
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
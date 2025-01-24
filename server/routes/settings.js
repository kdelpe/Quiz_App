const express = require('express');
const path = require('path');
const router = express.Router();
const User = require('../models/User');
const Leaderboard = require('../models/Leaderboard');

router.use(express.json());

router.get('/get-profile', async (req, res) => {
    try {
        const username = req.query.username;

        if (!username) {
            return res.status(400).json({ error: 'Username is required.' });
        }

        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        res.json({ username: user.username, email: user.email, password: user.password });
    } catch (error) {
        console.error('Error fetching profile data:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.post('/update-profile', async (req, res) => {
    try {
        const { currentUsername, newUsername, newEmail, newPassword } = req.body;

        const user = await User.findOne({ username: currentUsername });
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Update user details
        if (newUsername) user.username = newUsername;
        if (newEmail) user.email = newEmail;
        if (newPassword) user.password = newPassword;

        await user.save();

        // Update username in leaderboard if changed
        if (newUsername && newUsername !== currentUsername) {
            const leaderboardEntry = await Leaderboard.findOne({ user: currentUsername });
            if (leaderboardEntry) {
                leaderboardEntry.user = newUsername;
                await leaderboardEntry.save();
            }
        }

        res.json({ message: 'Profile updated successfully' });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

router.delete('/delete-user', async (req, res) => {
    try {
        const { username } = req.body;

        // Delete user
        const result = await User.deleteOne({ username });
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }

        // Delete leaderboard entry
        await Leaderboard.deleteOne({ user: username });

        res.json({ message: 'Account deactivated successfully.' });
    } catch (error) {
        console.error('Error deactivating account:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

module.exports = router;
const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

router.use(express.json());

// router.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../../client/html/settings.html'));
// });

router.get('/get-profile', async (req, res) => {
  try {
    const username = req.query.username;

    if (!username) {
      return res.status(400).json({ error: 'Username is required.' });
    }

    const userDBPath = path.join(__dirname, '../../data/userDB.json');
    const userDBData = await fs.readFile(userDBPath, 'utf8');
    const userDB = JSON.parse(userDBData);

    const user = userDB.users.find(user => user.username === username);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ username: user.username, email: user.email, password: user.password });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

const userDBPath = path.join(__dirname, '../../data/userDB.json');

router.put('/update-profile', async (req, res) => {
  try {
    const { username, email, password, currentUsername } = req.body;

    if (!username || !email || !password || !currentUsername) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const userDBData = await fs.readFile(userDBPath, 'utf8');
    const userDB = JSON.parse(userDBData);

    // Existing credentials validation checks
    const currentUser = userDB.users.find(user => user.username === currentUsername);
    if (!currentUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const usernameExists = userDB.users.some(user => user.username === username && user.username !== currentUsername);
    const emailExists = userDB.users.some(user => user.email === email && user.email !== currentUser.email);

    if (usernameExists) {
      return res.status(409).json({ error: 'Username is already taken.' });
    }
    if (emailExists) {
      return res.status(409).json({ error: 'Email is already in use.' });
    }

    // Update 
    currentUser.username = username;
    currentUser.email = email;
    currentUser.password = password; // Ideally, hash the password before saving

    await fs.writeFile(userDBPath, JSON.stringify(userDB, null, 4));

    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
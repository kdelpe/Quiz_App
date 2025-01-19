const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/html/profile.html'));
});

router.get('/data', async (req, res) => {
  try {
      const username  = req.query.username;

      if (!username) {
          return res.status(401).json({ error: 'Unauthorized: Please log in.' });
      }

      const userDBPath = path.join(__dirname, '../../data/userDB.json');
      const userDBData = await fs.readFile(userDBPath, 'utf8');
      const userDB = JSON.parse(userDBData);

      const user = userDB.users.find(user => user.username === username);

      if (!user) {
          return res.status(404).json({ error: 'User not found.' });
      }

      res.json({ username: user.username, stats: user.stats || [] });
  } catch (error) {
      console.error('Error fetching profile data:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

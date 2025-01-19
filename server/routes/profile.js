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

// Delete user by username
router.delete('/delete-user', async (req, res) => {
    try {
      const { username } = req.body;
  
      if (!username) {
        return res.status(400).json({ error: 'Username is required' });
      }
  
      // Paths to the databases
      const userDBPath = path.join(__dirname, '../../data/userDB.json');
      const leaderboardPath = path.join(__dirname, '../../data/leaderboardDB.json');
  
      // Load user database
      const userDBData = await fs.readFile(userDBPath, 'utf8');
      const userDB = JSON.parse(userDBData);
  
      // Remove user from the user database
      const userIndex = userDB.users.findIndex(user => user.username === username);
      if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
      }
      userDB.users.splice(userIndex, 1);
  
      // Load leaderboard database
      const leaderboardData = await fs.readFile(leaderboardPath, 'utf8');
      const leaderboardDB = JSON.parse(leaderboardData);
  
      // Remove user from the leaderboard
      leaderboardDB.leaderboard = leaderboardDB.leaderboard.filter(entry => entry.user !== username);
  
      // Save the updated databases
      await fs.writeFile(userDBPath, JSON.stringify(userDB, null, 4));
      await fs.writeFile(leaderboardPath, JSON.stringify(leaderboardDB, null, 4));
  
      res.json({ message: 'User and stats deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

module.exports = router;

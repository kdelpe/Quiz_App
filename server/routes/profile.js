const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const userDBPath = path.join(__dirname, '../data/userDB.json');
const leaderboardDBPath = path.join(__dirname, '../data/leaderboardDB.json');

router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/html/profile.html'));
});

module.exports = router;

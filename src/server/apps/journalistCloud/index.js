const path = require('path');
const express = require('express');
const router = express.Router();
const config = require('../../config');

router.get('/', (req, res) => {
  res.sendFile(path.join(config.appsPath, 'journalistCloud', 'index.html'));
});

module.exports = router;

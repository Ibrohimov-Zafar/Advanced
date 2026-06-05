const express = require('express');
const router = express.Router();
const { staff } = require('../utils/dataStore');

router.get('/', (req, res) => {
  res.json(staff.map((s) => s.toJSON()));
});

module.exports = router;

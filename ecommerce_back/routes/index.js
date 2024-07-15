const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

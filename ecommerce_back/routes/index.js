const express = require('express');
const router = express.Router();
const db = require('../config/db');

/* GET home page. */
router.get('/', async (req, res, next) => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM produit');
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

module.exports = router;

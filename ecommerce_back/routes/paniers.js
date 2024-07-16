const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Cart = require('../models/panier');

//ADD
router.post('/add', async (req, res, next) => {
  const { id_utilisateur, date_creation, statut, total } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Panier (id_utilisateur, date_creation, statut, total) VALUES (?, ?, ?, ?)',
      [id_utilisateur, date_creation, statut, total]
    );
    const newCart = new Cart(result.insertId, id_utilisateur, date_creation, statut, total);
    res.status(201).json(newCart);
  } catch (err) {
    next(err);
  }
});

//GET ALL
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM Panier');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

//GET ONE
router.get('/:id_panier', async (req, res, next) => {
  const { id_panier } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Panier WHERE id_panier = ?', [id_panier]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Panier non trouvé' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

//PUT
router.put('/put/:id_panier', async (req, res, next) => {
  const { id_panier } = req.params;
  const { id_utilisateur, date_creation, statut, total } = req.body;
  try {
    await db.query(
      'UPDATE Panier SET id_utilisateur = ?, date_creation = ?, statut = ?, total = ? WHERE id_panier = ?',
      [id_utilisateur, date_creation, statut, total, id_panier]
    );
    res.status(200).json({ id_panier, id_utilisateur, date_creation, statut, total });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/delete/:id_panier', async (req, res, next) => {
  const { id_panier } = req.params;
  try {
    await db.query('DELETE FROM Panier WHERE id_panier = ?', [id_panier]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

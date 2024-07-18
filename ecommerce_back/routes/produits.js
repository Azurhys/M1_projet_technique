const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Product = require('../models/produit');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roles');

//POST
router.post('/',authMiddleware, checkRole([1]), async (req, res, next) => {
  const { nom, description, prix, stock, image_url, id_categorie } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Produit (nom, description, prix, stock, image_url, id_categorie) VALUES (?, ?, ?, ?, ?, ?)',
      [nom, description, prix, stock, image_url, id_categorie]
    );
    const newProduct = new Product(result.insertId, nom, description, prix, stock, image_url, id_categorie);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

//PUT
router.put('/:id_produit',authMiddleware, checkRole([1]), async (req, res, next) => {
  const { id_produit } = req.params;
  const { nom, description, prix, stock, image_url, id_categorie } = req.body;
  try {
    await db.query(
      'UPDATE Produit SET nom = ?, description = ?, prix = ?, stock = ?, image_url = ?, id_categorie = ? WHERE id_produit = ?',
      [nom, description, prix, stock, image_url, id_categorie, id_produit]
    );
    res.status(200).json({ id_produit, nom, description, prix, stock, image_url, id_categorie });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/:id_produit',authMiddleware, checkRole([1]), async (req, res, next) => {
  const { id_produit } = req.params;
  try {
    await db.query('DELETE FROM Produit WHERE id_produit = ?', [id_produit]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//GET ALL
router.get('/', async (req, res, next) => {
    try {
      const [rows] = await db.query('SELECT * FROM Produit');
      res.status(200).json(rows);
    } catch (err) {
      next(err);
    }
});

//GET ONE
router.get('/:id_produit', async (req, res, next) => {
    const { id_produit } = req.params;
    try {
      const [rows] = await db.query('SELECT * FROM Produit WHERE id_produit = ?', [id_produit]);
      if (rows.length === 0) {
        res.status(404).json({ message: 'Produit non trouvé' });
      } else {
        res.status(200).json(rows[0]);
      }
    } catch (err) {
      next(err);
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const CartProduct = require('../models/panierProduit');

//ADD
router.post('/', async (req, res, next) => {
  const { id_panier, id_produit, quantite } = req.body;
  try {
    await db.query(
      'INSERT INTO Panier_Produit (id_panier, id_produit, quantite) VALUES (?, ?, ?)',
      [id_panier, id_produit, quantite]
    );
    const newCartProduct = new CartProduct(id_panier, id_produit, quantite);
    res.status(201).json(newCartProduct);
  } catch (err) {
    next(err);
  }
});

//GET ALL
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM Panier_Produit');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

//GET MANY
router.get('/:id_panier', async (req, res, next) => {
  const { id_panier } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Panier_Produit WHERE id_panier = ?', [id_panier]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Aucun produit trouvé dans ce panier' });
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
});

//GET MANY
router.get('/infos/:id_panier', async (req, res, next) => {
  const { id_panier } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Panier_Produit INNER JOIN Produit WHERE Panier_Produit.id_produit = Produit.id_produit AND id_panier = ?', [id_panier]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Aucun produit trouvé dans ce panier' });
    } else {
      res.status(200).json(rows);
    }
  } catch (err) {
    next(err);
  }
});

//PUT
router.put('/:id_panier/:id_produit', async (req, res, next) => {
  const { id_panier, id_produit } = req.params;
  const { quantite } = req.body;
  try {
    await db.query(
      'UPDATE Panier_Produit SET quantite = ? WHERE id_panier = ? AND id_produit = ?',
      [quantite, id_panier, id_produit]
    );
    res.status(200).json({ id_panier, id_produit, quantite });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/:id_panier/:id_produit', async (req, res, next) => {
  const { id_panier, id_produit } = req.params;
  try {
    await db.query('DELETE FROM Panier_Produit WHERE id_panier = ? AND id_produit = ?', [id_panier, id_produit]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const CartProduct = require('../models/panierProduit');

//ADD
router.post('/', async (req, res, next) => {
  const { id_panier, id_produit, quantite } = req.body;
  try {
    console.log('Requête reçue pour ajouter un produit au panier:', req.body);

    const [existingEntries] = await db.query(
      'SELECT * FROM Panier_Produit WHERE id_panier = ? AND id_produit = ?',
      [id_panier, id_produit]
    );

    if (existingEntries.length > 0) {
      // Si l'entrée existe déjà, renvoyez un message d'erreur
      res.status(409).json({ error: 'Le produit existe déjà dans le panier' });
    } else {
      // Sinon, insérez la nouvelle entrée
      const [result] = await db.query(
        'INSERT INTO Panier_Produit (id_panier, id_produit, quantite) VALUES (?, ?, ?)',
        [id_panier, id_produit, quantite]
      );

      const newCartProduct = new CartProduct(id_panier, id_produit, quantite);
      res.status(201).json(newCartProduct);
    }
  } catch (err) {
    console.error('Erreur lors de l\'ajout du produit au panier:', err);
    res.status(500).json({ error: 'Erreur interne du serveur', details: err.message });
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

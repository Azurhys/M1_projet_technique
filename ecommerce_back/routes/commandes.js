const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Order = require('../models/commande');

//ADD
router.post('/add', async (req, res, next) => {
  const { id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Commande (id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande]
    );
    const newOrder = new Order(result.insertId, id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande);
    res.status(201).json(newOrder);
  } catch (err) {
    next(err);
  }
});

//GET ALL
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM Commande');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

//GET ONE
router.get('/:id_commande', async (req, res, next) => {
  const { id_commande } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Commande WHERE id_commande = ?', [id_commande]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Commande non trouvée' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

//PUT
router.put('/put/:id_commande', async (req, res, next) => {
  const { id_commande } = req.params;
  const { id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande } = req.body;
  try {
    await db.query(
      'UPDATE Commande SET id_utilisateur = ?, id_panier = ?, date_commande = ?, total = ?, adresse_livraison = ?, adresse_facturation = ?, mode_paiement = ?, statut_commande = ? WHERE id_commande = ?',
      [id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande, id_commande]
    );
    res.status(200).json({ id_commande, id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/delete/:id_commande', async (req, res, next) => {
  const { id_commande } = req.params;
  try {
    await db.query('DELETE FROM Commande WHERE id_commande = ?', [id_commande]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

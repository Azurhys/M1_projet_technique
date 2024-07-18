const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Order = require('../models/commande');
const sendOrderSummary = require('../utils/sendEmail');
const getUserEmail = require('../utils/getUserEmail');

//ADD
router.post('/', async (req, res, next) => {
  const { id_utilisateur, id_panier, date_commande, nom, prenom, adresse_livraison, adresse_facturation, numero_carte, date_expir, cryptogramme, statut_commande } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Commande (id_utilisateur, id_panier, date_commande, nom, prenom, adresse_livraison, adresse_facturation, numero_carte, date_expir, cryptogramme, statut_commande) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id_utilisateur, id_panier, date_commande, nom, prenom, adresse_livraison, adresse_facturation, numero_carte, date_expir, cryptogramme, statut_commande]
    );

    const newOrder = {
      id_commande: result.insertId,
      id_utilisateur: id_utilisateur,
      id_panier: id_panier,
      date_commande: date_commande,
      nom: nom,
      prenom: prenom,
      adresse_livraison: adresse_livraison,
      adresse_facturation: adresse_facturation,
      numero_carte: numero_carte,
      date_expir: date_expir,
      cryptogramme: cryptogramme,
      statut_commande: statut_commande
    };

    // Envoi de l'email de récapitulatif de commande
    const userEmail = await getUserEmail(id_utilisateur);
    if (userEmail) {
      const subject = 'Récapitulatif de votre commande';
      const text = `Merci pour votre commande. Voici les détails:\n\nAdresse de livraison: ${adresse_livraison}\nAdresse de facturation: ${adresse_facturation}\nStatut de la commande: ${statut_commande}`;
      const html = `<h1>Merci pour votre commande</h1><p>Voici les détails:</p><ul><li>Adresse de livraison: ${adresse_livraison}</li><li>Adresse de facturation: ${adresse_facturation}</li><li>Statut de la commande: ${statut_commande}</li></ul>`;

      await sendOrderSummary(userEmail, subject, text, html);
    } else {
      console.error('Email de l\'utilisateur non trouvé');
    }

    res.status(201).json(newOrder);

  } catch (err) {
    console.error('Erreur lors de l\'ajout de la commande:', err);
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la commande' });
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
router.put('/:id_commande', async (req, res, next) => {
  const { id_commande } = req.params;
  const {date_commande, adresse_livraison, adresse_facturation, statut_commande } = req.body;
  try {
    await db.query(
      'UPDATE Commande SET date_commande = ?, adresse_livraison = ?, adresse_facturation = ?, statut_commande = ? WHERE id_commande = ?',
      [date_commande, adresse_livraison, adresse_facturation, statut_commande, id_commande]
    );
    res.status(200).json({ id_commande, date_commande, adresse_livraison, adresse_facturation, statut_commande });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/:id_commande', async (req, res, next) => {
  const { id_commande } = req.params;
  try {
    await db.query('DELETE FROM Commande WHERE id_commande = ?', [id_commande]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;

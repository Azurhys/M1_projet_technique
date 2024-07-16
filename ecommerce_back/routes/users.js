const express = require('express');
const router = express.Router();
const db = require('../config/db');
const User = require('../models/user');

//ADD
router.post('/add', async (req, res, next) => {
  const { nom, prenom, email, mot_de_passe, adresse, telephone, droit } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, adresse, telephone, droit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, mot_de_passe, adresse, telephone, droit]
    );
    const newUser = new User(result.insertId, nom, prenom, email, mot_de_passe, adresse, telephone, droit);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

//GET ALL
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM Utilisateur');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

//GET ONE
router.get('/:id_utilisateur', async (req, res, next) => {
  const { id_utilisateur } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

//PUT
router.put('/put/:id_utilisateur', async (req, res, next) => {
  const { id_utilisateur } = req.params;
  const { nom, prenom, email, mot_de_passe, adresse, telephone, droit } = req.body;
  try {
    await db.query(
      'UPDATE Utilisateur SET nom = ?, prenom = ?, email = ?, mot_de_passe = ?, adresse = ?, telephone = ?, droit = ? WHERE id_utilisateur = ?',
      [nom, prenom, email, mot_de_passe, adresse, telephone, droit, id_utilisateur]
    );
    res.status(200).json({ id_utilisateur, nom, prenom, email, mot_de_passe, adresse, telephone, droit });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/delete/:id_utilisateur', async (req, res, next) => {
  const { id_utilisateur } = req.params;
  try {
    await db.query('DELETE FROM Utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});



module.exports = router;

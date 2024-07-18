const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth')

//RESGISTER
router.post('/register', async (req, res, next) => {
  const { nom, prenom, email, mot_de_passe, adresse, telephone, droit } = req.body;
  try {

    const [existingUser] = await db.query('SELECT email FROM Utilisateur WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);


    const [result] = await db.query(
      'INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, adresse, telephone, droit) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nom, prenom, email, hashedPassword, adresse, telephone, droit]
    );

    const newUser = new User(result.insertId, nom, prenom, email, hashedPassword, adresse, telephone, droit);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
});

//LOGIN
router.post('/login', async (req, res, next) => {
  const { email, mot_de_passe } = req.body;
  try {
    const [user] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isMatch = await bcrypt.compare(mot_de_passe, user[0].mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const IdUser = user[0].id_utilisateur;

    const tokenPayload = {
        id_utilisateur: user[0].id_utilisateur,
        nom: user[0].nom,
        prenom: user[0].prenom,
        email: user[0].email,
        droit: user[0].droit
      };

      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { id_utilisateur } = req.user;
    const [rows] = await db.query('SELECT * FROM Utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.patch('/profile', authMiddleware, async (req, res, next) => {
  const { id_utilisateur } = req.user;
  const { nom, prenom, email, adresse, telephone } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE Utilisateur SET nom = ?, prenom = ?, email = ?, adresse = ?, telephone = ? WHERE id_utilisateur = ?',
      [nom, prenom, email, adresse, telephone, id_utilisateur]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Informations mises à jour avec succès' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

// ROUTE POUR RÉCUPÉRER LES INFORMATIONS DE L'UTILISATEUR CONNECTÉ
router.get('/me', authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;

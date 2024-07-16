const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const User = require('../models/user');

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
    // Vérifier si l'utilisateur existe
    const [user] = await db.query('SELECT * FROM Utilisateur WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Comparer le mot de passe
    const isMatch = await bcrypt.compare(mot_de_passe, user[0].mot_de_passe);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier les informations utilisateur
    console.log('Utilisateur:', user[0]); // Ajouter un log pour vérifier les informations utilisateur

    // Créer le token JWT en incluant le rôle de l'utilisateur
    const tokenPayload = {
        id_utilisateur: user[0].id_utilisateur,
        role: user[0].droit,
        email: user[0].email
      };
      console.log('Token Payload:', tokenPayload); // Log pour vérifier le payload du token
  
      const token = jwt.sign(
        tokenPayload,
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );

    console.log('Token généré:', token); // Ajouter un log pour vérifier le token généré

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

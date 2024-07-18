const express = require('express');
const router = express.Router();
const db = require('../config/db');
const SousCategory = require('../models/souscategorie');
const authMiddleware = require('../middleware/auth');
const checkRole = require('../middleware/roles');

// ADD a subcategory
router.post('/', authMiddleware, checkRole([1]),async (req, res, next) => {
  const { nom, id_categorie } = req.body;
  try {
    const [result] = await db.query('INSERT INTO SousCategories (nom, id_categorie) VALUES (?, ?)', [nom, id_categorie]);
    const newSousCategory = new SousCategory(result.insertId, nom, id_categorie);
    res.status(201).json(newSousCategory);
  } catch (err) {
    next(err);
  }
});

// UPDATE a subcategory
router.put('/:id_souscategorie', authMiddleware, checkRole([1]),async (req, res, next) => {
  const { id_souscategorie } = req.params;
  const { nom, id_categorie } = req.body;
  try {
    await db.query('UPDATE SousCategories SET nom = ?, id_categorie = ? WHERE id_souscategorie = ?', [nom, id_categorie, id_souscategorie]);
    res.status(200).json({ id_souscategorie, nom, id_categorie });
  } catch (err) {
    next(err);
  }
});

// DELETE a subcategory
router.delete('/:id_souscategorie',authMiddleware, checkRole([1]), async (req, res, next) => {
  const { id_souscategorie } = req.params;
  try {
    await db.query('DELETE FROM SousCategories WHERE id_souscategorie = ?', [id_souscategorie]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// GET all subcategories
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM SousCategories');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

// GET one subcategory
router.get('/:id_souscategorie', async (req, res, next) => {
  const { id_souscategorie } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM SousCategories WHERE id_souscategorie = ?', [id_souscategorie]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Sous-catégorie non trouvée' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

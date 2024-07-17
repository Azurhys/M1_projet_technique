const express = require('express');
const router = express.Router();
const db = require('../config/db');
const Category = require('../models/categorie');

//ADD
router.post('/', async (req, res, next) => {
  const { nom, id_categorie_parent } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO Categorie (nom, id_categorie_parent) VALUES (?, ?)',
      [nom, id_categorie_parent]
    );
    const newCategory = new Category(result.insertId, nom, id_categorie_parent);
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

//PUT
router.put('/:id_categorie', async (req, res, next) => {
  const { id_categorie } = req.params;
  const { nom, id_categorie_parent } = req.body;
  try {
    await db.query(
      'UPDATE Categorie SET nom = ?, id_categorie_parent = ? WHERE id_categorie = ?',
      [nom, id_categorie_parent, id_categorie]
    );
    res.status(200).json({ id_categorie, nom, id_categorie_parent });
  } catch (err) {
    next(err);
  }
});

//DELETE
router.delete('/:id_categorie', async (req, res, next) => {
  const { id_categorie } = req.params;
  try {
    await db.query('DELETE FROM Categorie WHERE id_categorie = ?', [id_categorie]);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

//GET ALL
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM Categorie');
    res.status(200).json(rows);
  } catch (err) {
    next(err);
  }
});

//GET ONE
router.get('/:id_categorie', async (req, res, next) => {
  const { id_categorie } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM Categorie WHERE id_categorie = ?', [id_categorie]);
    if (rows.length === 0) {
      res.status(404).json({ message: 'Catégorie non trouvée' });
    } else {
      res.status(200).json(rows[0]);
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;

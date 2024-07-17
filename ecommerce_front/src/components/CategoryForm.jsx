import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    id_categorie: '',
    nom: '',
    id_categorie_parent: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axios.get('http://localhost:3000/categories');
      setCategories(response.data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category.id_categorie) {
      await axios.put(`http://localhost:3000/categories/${category.id_categorie}`, category);
    } else {
      await axios.post('http://localhost:3000/categories', category);
    }
    setCategory({
      id_categorie: '',
      nom: '',
      id_categorie_parent: ''
    });
    const response = await axios.get('http://localhost:3000/categories');
    setCategories(response.data);
  };

  const handleEdit = (category) => {
    setCategory(category);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/categories/${id}`);
    setCategories(categories.filter((cat) => cat.id_categorie !== id));
  };

  return (
    <div>
      <h2>Gérer les Catégories</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={category.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Catégorie Parente</label>
          <select
            className="form-control"
            name="id_categorie_parent"
            value={category.id_categorie_parent}
            onChange={handleChange}
          >
            <option value="">Aucune</option>
            {categories.map((cat) => (
              <option key={cat.id_categorie} value={cat.id_categorie}>
                {cat.nom}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn btn-primary">
          {category.id_categorie ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
      <h3>Liste des Catégories</h3>
      <ul>
        {categories.map((cat) => (
          <li key={cat.id_categorie}>
            {cat.nom}
            <button onClick={() => handleEdit(cat)}>Modifier</button>
            <button onClick={() => handleDelete(cat.id_categorie)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoryForm;

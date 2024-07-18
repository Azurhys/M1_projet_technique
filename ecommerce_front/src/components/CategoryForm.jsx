import React, { useState, useEffect } from 'react';
import ProtectedRoute from './ProtectedRoute';

const CategoryForm = () => {
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    id_categorie: '',
    nom: '',
    id_categorie_parent: ''
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        const categoriesData = await response.json();

        const responseSubCategories = await fetch('http://localhost:3000/souscategories');
        const subCategoriesData = await responseSubCategories.json();

        const categoriesWithSubCategories = categoriesData.map(cat => {
          return {
            ...cat,
            subcategories: subCategoriesData.filter(subCat => subCat.id_categorie === cat.id_categorie)
          };
        });

        setCategories(categoriesWithSubCategories);
      } catch (error) {
        console.error('Erreur lors de la récupération des catégories :', error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (category.id_categorie) {
        if (category.id_categorie_parent) {
          await fetch(`http://localhost:3000/souscategories/${category.id_categorie}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nom: category.nom,
              id_categorie: category.id_categorie_parent
            })
          });
        } else {
          await fetch(`http://localhost:3000/categories/${category.id_categorie}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom: category.nom })
          });
        }
      } else {
        if (category.id_categorie_parent) {
          await fetch('http://localhost:3000/souscategories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              nom: category.nom,
              id_categorie: category.id_categorie_parent
            })
          });
        } else {
          await fetch('http://localhost:3000/categories', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nom: category.nom })
          });
        }
      }
      setCategory({
        id_categorie: '',
        nom: '',
        id_categorie_parent: ''
      });
      const response = await fetch('http://localhost:3000/categories');
      const categoriesData = await response.json();

      const responseSubCategories = await fetch('http://localhost:3000/souscategories');
      const subCategoriesData = await responseSubCategories.json();

      const categoriesWithSubCategories = categoriesData.map(cat => {
        return {
          ...cat,
          subcategories: subCategoriesData.filter(subCat => subCat.id_categorie === cat.id_categorie)
        };
      });

      setCategories(categoriesWithSubCategories);
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire :', error);
    }
  };

  const handleEdit = (category) => {
    setCategory(category);
  };

  const handleDelete = async (id, isSubCategory) => {
    try {
      if (isSubCategory) {
        await fetch(`http://localhost:3000/souscategories/${id}`, {
          method: 'DELETE'
        });
      } else {
        await fetch(`http://localhost:3000/categories/${id}`, {
          method: 'DELETE'
        });
      }
      const response = await fetch('http://localhost:3000/categories');
      const categoriesData = await response.json();

      const responseSubCategories = await fetch('http://localhost:3000/souscategories');
      const subCategoriesData = await responseSubCategories.json();

      const categoriesWithSubCategories = categoriesData.map(cat => {
        return {
          ...cat,
          subcategories: subCategoriesData.filter(subCat => subCat.id_categorie === cat.id_categorie)
        };
      });

      setCategories(categoriesWithSubCategories);
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie :', error);
    }
  };

  return (
    <ProtectedRoute requiredRole={1}>
    <div className="container my-5">
      <h2 className="mb-4">Gérer les Catégories</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
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
        <div className="form-group mb-3">
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
      <h3 className="mt-5">Liste des Catégories</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <React.Fragment key={cat.id_categorie}>
              <tr>
                <td>{cat.nom}</td>
                <td className="d-flex align-items-center">
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(cat)}>Modifier</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(cat.id_categorie, false)}>Supprimer</button>
                </td>
              </tr>
              {cat.subcategories && cat.subcategories.map((subCat) => (
                <tr key={subCat.id_souscategorie} className="table-secondary">
                  <td className="ps-4">↳ {subCat.nom}</td>
                  <td className="d-flex align-items-center">
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEdit(subCat)}>Modifier</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(subCat.id_souscategorie, true)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
    </ProtectedRoute>  
  );
};

export default CategoryForm;

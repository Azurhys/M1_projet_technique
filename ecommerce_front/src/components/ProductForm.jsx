import React, { useState, useEffect, useContext } from 'react';
import ProtectedRoute from './ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';

const ProductForm = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState({
    id_produit: '',
    nom: '',
    description: '',
    prix: '',
    stock: '',
    id_categorie: '',
    image_url: ''
  });
  const { token } = useContext(AuthContext);
  const requestOptions = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch('http://localhost:3000/produits', requestOptions);
        const productsData = await productsResponse.json();
        const categoriesResponse = await fetch('http://localhost:3000/categories', requestOptions);
        const categoriesData = await categoriesResponse.json();
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = product.id_produit ? 'PUT' : 'POST';
      const url = product.id_produit
        ? `http://localhost:3000/produits/${product.id_produit}`
        : 'http://localhost:3000/produits';
        
      const requestOptions = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(product)
      };
  
      const response = await fetch(url, requestOptions);
  
      if (!response.ok) {
        throw new Error(`Erreur HTTP! statut: ${response.status}`);
      }
  
      setProduct({
        id_produit: '',
        nom: '',
        description: '',
        prix: '',
        stock: '',
        id_categorie: '',
        image_url: ''
      });
  
      // Recharger les produits après la modification
      const productsResponse = await fetch('http://localhost:3000/produits', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const productsData = await productsResponse.json();
      setProducts(productsData);
    } catch (error) {
      console.error("Erreur lors de la soumission du formulaire :", error);
    }
  };

  const handleEdit = (product) => {
    setProduct(product);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/produits/${id}`, requestOptions, {
        method: 'DELETE'
      });
      setProducts(products.filter((product) => product.id_produit !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression du produit :", error);
    }
  };

  return (
    <ProtectedRoute requiredRole={1}>
    <div className="container my-5">
      <h2 className="mb-4">Gérer les Produits</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Nom</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={product.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Description</label>
          <input
            type="text"
            className="form-control"
            name="description"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Prix</label>
          <input
            type="number"
            step="0.01"
            className="form-control"
            name="prix"
            value={product.prix}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Stock</label>
          <input
            type="number"
            className="form-control"
            name="stock"
            value={product.stock}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group mb-3">
          <label>Catégorie</label>
          {categories.length > 0 ? (
            <select
              className="form-control"
              name="id_categorie"
              value={product.id_categorie}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionnez une catégorie</option>
              {categories.map((category) => (
                <option key={category.id_categorie} value={category.id_categorie}>
                  {category.nom}
                </option>
              ))}
            </select>
          ) : (
            <p>Chargement des catégories...</p>
          )}
        </div>
        <div className="form-group mb-3">
          <label>Image URL</label>
          <input
            type="text"
            className="form-control"
            name="image_url"
            value={product.image_url}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {product.id_produit ? 'Modifier' : 'Ajouter'}
        </button>
      </form>
      <h3 className="mt-5">Liste des Produits</h3>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Prix</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id_produit}>
              <td>{product.nom}</td>
              <td>{product.description}</td>
              <td>{product.prix}</td>
              <td>{product.stock}</td>
              <td className="d-flex align-items-center">
                <button className="btn btn-warning  me-2 my-3" onClick={() => handleEdit(product)}>Modifier</button>
                <button className="btn btn-danger " onClick={() => handleDelete(product.id_produit)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </ProtectedRoute>
  );
};

export default ProductForm;

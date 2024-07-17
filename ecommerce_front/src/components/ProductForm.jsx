import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchData = async () => {
      const productsResponse = await axios.get('http://localhost:3000/produits');
      const categoriesResponse = await axios.get('http://localhost:3000/categories');
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (product.id_produit) {
      await axios.put(`http://localhost:3000/produits/${product.id_produit}`, product);
    } else {
      await axios.post('http://localhost:3000/produits', product);
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
    const productsResponse = await axios.get('http://localhost:3000/produits');
    setProducts(productsResponse.data);
  };

  const handleEdit = (product) => {
    setProduct(product);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:3000/produits/${id}`);
    setProducts(products.filter((product) => product.id_produit !== id));
  };

  return (
    <div>
      <h2>Gérer les Produits</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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
        <div className="form-group">
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
      <h3>Liste des Produits</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id_produit}>
            {product.nom} - {product.description} - {product.prix} - {product.stock}
            <button onClick={() => handleEdit(product)}>Modifier</button>
            <button onClick={() => handleDelete(product.id_produit)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductForm;

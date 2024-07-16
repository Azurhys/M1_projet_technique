import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaFilter } from 'react-icons/fa';

const Articles = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/produits');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchProducts();
        fetchCategories();
    }, []);

    const filteredProducts = products.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCategory === '' || product.id_categorie === selectedCategory)
    );

    return (
        <div className="container">
            <div className="row my-4">
                <div className="col-9">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="col-3 d-flex align-items-center">
                    <div className="dropdown w-100">
                        <button className="btn btn-outline-secondary dropdown-toggle w-100" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                            <FaFilter /> Filtrer par catégorie
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                            <li><button className="dropdown-item" onClick={() => setSelectedCategory('')}>Toutes les catégories</button></li>
                            {categories.map(category => (
                                <li key={category.id}>
                                    <button className="dropdown-item" onClick={() => setSelectedCategory(category.id_categorie)}>{category.nom}</button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="row">
                {filteredProducts.map(product => (
                    <div key={product.id_produit} className="col-md-4 mb-4">
                        <div className="card h-100 d-flex flex-column">
                            <div className="d-flex justify-content-center align-items-center" style={{ height: '300px', overflow: 'hidden' }}>
                                <img
                                    src={`../../images/${product.id_produit}-1.jpg`}
                                    className="card-img-top"
                                    alt={product.nom}
                                    style={{ height: '80%', width: 'auto' }}
                                />
                            </div>
                            <div className="card-body d-flex flex-column">
                                <h5 className="card-title">{product.nom}</h5>
                                <p className="card-text flex-grow-1">{product.description}</p>
                                <p className="card-text"><strong>Prix:</strong> {product.prix}€</p>
                                {product.stock > 0 ?
                                    (
                                        <p className="card-text text-success"><strong>En stock</strong></p>
                                    )
                                    :
                                    (
                                        <p className="card-text text-danger"><strong>Hors stock</strong></p>
                                    )
                                }
                                <button className="btn btn-primary mt-auto">Ajouter au panier</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;
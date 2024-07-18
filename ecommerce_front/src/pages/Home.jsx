import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:3000/categories');
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        const fetchCategoryProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/produits');
                const data = await response.json();
                const productsByCategory = {};

                data.forEach(product => {
                    if (!productsByCategory[product.id_categorie]) {
                        productsByCategory[product.id_categorie] = [];
                    }
                    if (productsByCategory[product.id_categorie].length < 2) {
                        productsByCategory[product.id_categorie].push(product);
                    }
                });

                setCategoryProducts(productsByCategory);
            } catch (error) {
                console.error('Error fetching products by category:', error);
            }
        };

        fetchCategories();
        fetchCategoryProducts();
    }, []);

    return (
        <div className="container">
            <div className="text-center my-5">
                <h2 className="display-4 fw-bold mb-4" style={{ color: '#333' }}>Découvrez Nos Meilleurs Produits</h2>
            </div>
            {categories.map(category => (
                <section key={category.id_categorie} className="my-5">
                    <h3 className="text-center mb-3">{category.nom}</h3>
                    <div className="row">
                        {categoryProducts[category.id_categorie]?.map(product => (
                            <div key={product.id_produit} className="col-md-6 mb-4">
                                <div
                                    className="card h-100 d-flex flex-column shadow-sm"
                                    onClick={() => navigate(`/details-article/${product.id_produit}`)}
                                    style={{ transition: 'transform 0.5s, box-shadow 0.5s' }}
                                    onMouseEnter={(e) => e.currentTarget.classList.add('shadow-lg')}
                                    onMouseLeave={(e) => e.currentTarget.classList.remove('shadow-lg')}
                                >
                                    <div className="d-flex justify-content-center align-items-center" style={{ height: '300px', overflow: 'hidden' }}>
                                        <img
                                            src={`http://localhost:3000/image/${product.id_produit}-1.jpg`}
                                            className="card-img-top"
                                            alt={product.nom}
                                            style={{ height: '80%', width: 'auto' }}
                                        />
                                    </div>
                                    <div className="card-body d-flex flex-column">
                                        <h5 className="card-title">{product.nom}</h5>
                                        <p className="card-text flex-grow-1">{product.description}</p>
                                        <p className="card-text"><strong>Prix:</strong> {product.prix}€</p>
                                        {product.stock > 0 ? (
                                            <p className="card-text text-success"><strong>En stock</strong></p>
                                        ) : (
                                            <p className="card-text text-danger"><strong>Hors stock</strong></p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    );
};

export default Home;
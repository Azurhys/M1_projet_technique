import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Articles = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:3000/');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.nom.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div className="row my-4">
                <div className="col">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            <div className="row">
                {filteredProducts.map(product => (
                    <div key={product.id_produit} className="col-md-4 mb-4">
                        <div className="card h-100">
                            <img
                                src={`../../images/${product.id_produit}-1.jpg`}
                                className="card-img-top"
                                alt={product.nom}
                                height={200}
                                width={'auto'}
                            />
                            <div className="card-body">
                                <h5 className="card-title">{product.nom}</h5>
                                <p className="card-text">{product.description}</p>
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
                                <button className="btn btn-primary">Ajouter au panier</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Articles;

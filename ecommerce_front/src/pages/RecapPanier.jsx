import React, { useState, useEffect } from 'react';

const RecapPanier = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
    }, []);

    const calculateProductTotal = (product) => {
        return product.price * product.quantity;
    };

    const calculateCartTotal = () => {
        return cartItems.reduce((acc, product) => acc + calculateProductTotal(product), 0);
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Récapitulatif du Panier</h2>
            <ul className="list-group">
                {cartItems.map(product => (
                    <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <img
                                src={`http://localhost:3000/image/${product.id}-1.jpg`}
                                className="img-fluid rounded"
                                alt={product.name}
                                style={{ maxHeight: '100px', maxWidth: '100px', marginRight: '20px' }}
                            />
                            <div>
                                <h5>{product.name}</h5>
                                <p>Prix unitaire: {product.price.toFixed(2)}€</p>
                                <p>Quantité: {product.quantity}</p>
                                <p>Total: {calculateProductTotal(product).toFixed(2)}€</p>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
            <div className='d-flex justify-content-between mt-5'>
                <p>Total Panier : <b>{calculateCartTotal().toFixed(2)}€</b></p>
                <button className="btn btn-primary">Passer à la commande</button>
            </div>
        </div>
    );
};

export default RecapPanier;
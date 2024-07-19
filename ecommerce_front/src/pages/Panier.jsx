import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Panier = () => {
    const [cart, setCart] = useState([]);
    const [stockError, setStockError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        savedCart.forEach(product => {
            product.price = parseFloat(product.price);
            product.quantity = parseInt(product.quantity);
        });
        setCart(savedCart);
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const removeProduct = (productId) => {
        setCart(cart.filter(product => product.id !== productId));
    };

    const calculateProductTotal = (product) => {
        return product.price * product.quantity;
    };

    const calculateCartTotal = () => {
        return cart.reduce((acc, product) => acc + calculateProductTotal(product), 0);
    };

    const checkStock = async (productId, quantity) => {
        try {
            const response = await fetch(`http://localhost:3000/produits/${productId}`);
            const data = await response.json();
            return data.stock >= quantity;
            set
        } catch (error) {
            console.error('Erreur lors de la vérification du stock:', error);
            return false;
        }
    };

    const handleQuantityChange = async (productId, newQuantity) => {
        setStockError(null);
        const inStock = await checkStock(productId, newQuantity);
        if (!inStock) {
            setStockError(`La quantité demandée dépasse le stock disponible pour le produit`);
            return;
        }
        setCart(cart.map(product =>
            product.id === productId ? { ...product, quantity: newQuantity } : product
        ));
    };

    const handleCheckout = async () => {
        setStockError(null);
        for (const product of cart) {
            const inStock = await checkStock(product.id, product.quantity);
            if (!inStock) {
                setStockError(`La quantité demandée pour le produit ${product.name} dépasse le stock disponible.`);
                return;
            }
        }
        navigate("/recap-panier");
    };

    return (
        <div className="container my-5">
            {cart.length > 0 ? (
                <div>
                    {stockError && <div className="alert alert-danger">{stockError}</div>}
                    <ul className="list-group">
                        {cart.map(product => (
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
                                        <div className="d-flex align-items-center">
                                            <p>Quantité: </p>
                                            <input
                                                type="number"
                                                value={product.quantity}
                                                min="1"
                                                className="form-control ml-2"
                                                style={{ width: '70px' }}
                                                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                                            />
                                        </div>
                                        <p>Total: {calculateProductTotal(product).toFixed(2)}€</p>
                                    </div>
                                </div>
                                <button className="btn btn-danger" onClick={() => removeProduct(product.id)}>
                                    <FaTrash className="me-1" /> Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className='d-flex justify-content-between mt-5'>
                        <p>Total Panier : <b>{calculateCartTotal().toFixed(2)}€</b></p>
                        <button className='btn btn-primary px-5' onClick={handleCheckout}>Valider</button>
                    </div>
                </div>
            ) : (
                <div className="text-center">
                    <h3>Votre panier est vide 😞</h3>
                </div>
            )}
        </div>
    );
};

export default Panier;
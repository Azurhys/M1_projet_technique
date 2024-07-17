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

    const handlePasserCommande = async () => {
        try {
            const total = calculateCartTotal();
            const newCart = {
                id_utilisateur: 1, // Vous pouvez remplacer par l'ID utilisateur actuel
                date_creation: new Date().toISOString(),
                statut: 'En cours',
                total
            };

            // Ajouter le panier
            const responsePanier = await fetch('http://localhost:3000/paniers/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCart),
            });

            if (responsePanier.ok) {
                const panier = await responsePanier.json();
                const panierId = panier.id_panier;

                // Ajouter les produits dans Panier_Produit
                for (const item of cartItems) {
                    const newCartProduct = {
                        id_panier: panierId,
                        id_produit: item.id,
                        quantite: item.quantity
                    };

                    const responsePanierProduit = await fetch('http://localhost:3000/panierProduits/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newCartProduct),
                    });

                    if (!responsePanierProduit.ok) {
                        throw new Error('Erreur lors de l\'ajout d\'un produit au panier');
                    }
                }

                alert('Commande réussie!');
            } else {
                alert('Erreur lors de la création du panier');
            }
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la commande');
        }
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
                <button className="btn btn-primary" onClick={handlePasserCommande}>Passer à la commande</button>
            </div>
        </div>
    );
};

export default RecapPanier;
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ProtectedRoute from '../components/ProtectedRoute';
import { AuthContext } from '../contexts/AuthContext';

const RecapPanier = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

    const { user } = useContext(AuthContext);
    const userId = user ? user.id_utilisateur : null;
    console.log(userId);

    useEffect(() => {
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
            let panierId;

            // Vérifier si l'utilisateur a déjà un panier
            const responseGetPanier = await fetch(`http://localhost:3000/paniers`);
            if (responseGetPanier.ok) {
                const paniers = await responseGetPanier.json();
                const existingPanier = paniers.find(panier => panier.id_utilisateur === userId);

                if (existingPanier) {
                    panierId = existingPanier.id_panier;

                    const responseGetPanierProduits = await fetch(`http://localhost:3000/panierProduits/${panierId}`);
                    if (responseGetPanierProduits.ok) {
                        const panierProduits = await responseGetPanierProduits.json();

                        if (Array.isArray(panierProduits)) {
                            for (const item of cartItems) {
                                const panierProduit = panierProduits.find(p => p.id_produit == item.id);
                                if (panierProduit) {
                                    const responsePanierProduit = await fetch(`http://localhost:3000/panierProduits/${panierId}/${item.id}`, {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({ quantite: item.quantity }),
                                    });
                                    if (!responsePanierProduit.ok) {
                                        console.error(`Erreur de mise à jour du produit ${item.id} dans le panier ${panierId}`);
                                    }
                                } else {
                                    await fetch('http://localhost:3000/panierProduits', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                            id_panier: panierId,
                                            id_produit: item.id,
                                            quantite: item.quantity
                                        }),
                                    });
                                }
                            }

                            // Supprimer les produits absents dans le panier local
                            for (const panierProduit of panierProduits) {
                                const foundInCart = savedCart.find(item => item.id == panierProduit.id_produit);
                                if (!foundInCart) {
                                    console.log(`Suppression du produit ${panierProduit.id_produit} du panier ${panierId}`);
                                    await fetch(`http://localhost:3000/panierProduits/${panierId}/${panierProduit.id_produit}`, {
                                        method: 'DELETE',
                                    });
                                }
                            }
                        } else {
                            toast.error("La réponse des produits du panier n\'est pas valide");
                            return;
                        }
                    } else {
                        toast.error("Erreur lors de la récupération des produits du panier");
                        return;
                    }
                } else {
                    // L'utilisateur n'a pas de panier, créez-en un nouveau
                    const newCart = {
                        id_utilisateur: userId,
                        date_creation: new Date().toISOString(),
                        statut: 'En cours',
                        total
                    };

                    const responsePanier = await fetch('http://localhost:3000/paniers/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newCart),
                    });

                    if (responsePanier.ok) {
                        const panier = await responsePanier.json();
                        panierId = panier.id_panier;

                        // Ajouter les produits dans Panier_Produit
                        for (const item of cartItems) {
                            await fetch('http://localhost:3000/panierProduits/', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    id_panier: panierId,
                                    id_produit: item.id,
                                    quantite: item.quantity
                                }),
                            });
                        }
                    } else {
                        toast.error("Erreur lors de la création du panier");
                        return;
                    }
                }
            } else {
                toast.error("Erreur lors de la vérification des paniers");
                return;
            }

            toast.success("Panier validé");
            navigate('/commande');
        } catch (error) {
            console.error('Erreur:', error);
            alert('Erreur lors de la commande');
        }
    };

    return (
        <ProtectedRoute requiredRole={0}>
            {cartItems.length > 0 ? (
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
            ) :
                (
                    <div className="text-center mt-5">
                        <h3>Votre panier est vide 😞</h3>
                    </div>
                )
            }
        </ProtectedRoute>
    );
};

export default RecapPanier;
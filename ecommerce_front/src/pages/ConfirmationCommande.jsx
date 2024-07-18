import React, { useEffect, useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';
import ProtectedRoute from '../components/ProtectedRoute';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConfirmationCommande = () => {
    const location = useLocation();
    const [commande, setCommande] = useState(null);
    const [panierProduits, setPanierProduits] = useState([]);
    const { token } = useContext(AuthContext);
    const requestOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };

    useEffect(() => {
        if (location.state && location.state.id_commande) {
            const fetchCommande = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/commandes/${location.state.id_commande}`, requestOptions);
                    if (response.ok) {
                        const data = await response.json();
                        setCommande(data);
                        fetchPanierProduits(data.id_panier);
                    } else {
                        toast.error("Erreur lors de la récupération de la commande");
                    }
                } catch (error) {
                    console.error('Erreur:', error);
                    toast.error("Erreur lors de la récupération de la commande");
                }
            };

            fetchCommande();
        }
    }, [location.state]);

    const fetchPanierProduits = async (id_panier) => {
        try {
            const response = await fetch(`http://localhost:3000/panierProduits/infos/${id_panier}`, requestOptions);
            if (response.ok) {
                const data = await response.json();
                setPanierProduits(data);
            } else {
                toast.error("Erreur lors de la récupération des produits du panier");
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la récupération des produits du panier");
        }
    };

    const handleCommandePay = async () => {
        if (!commande) return;

        const {
            id_commande,
            date_commande,
            adresse_livraison,
            adresse_facturation,
        } = commande;

        try {
            const response = await fetch(`http://localhost:3000/commandes/${id_commande}`, requestOptions, {
                method: 'PUT',
                body: JSON.stringify({
                    date_commande,
                    adresse_livraison,
                    adresse_facturation,
                    statut_commande: 'payé'
                }),
            });

            if (response.ok) {
                toast.success("Commande payée avec succès");
                setCommande({ ...commande, statut_commande: 'payé' });
            } else {
                toast.error("Erreur lors de la mise à jour du statut de la commande");
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la mise à jour du statut de la commande");
        }
    };

    if (!commande || panierProduits.length === 0) {
        return (
            <div className="container my-5">
                <h2 className="text-center">Chargement...</h2>
            </div>
        );
    }

    const { adresse_livraison, numero_carte } = commande;

    // Fonction pour masquer tous les chiffres sauf les 4 premiers et ajouter des étoiles
    const maskCardNumber = (cardNumber) => {
        const visibleDigits = 4;
        const maskedSection = cardNumber.slice(0, -visibleDigits).replace(/\d/g, '*');
        const visibleSection = cardNumber.slice(-visibleDigits);
        return `${maskedSection}${visibleSection}`;
    };

    return (
        <ProtectedRoute requiredRole={0}>
            <div className="container my-5">
                <h2 className="text-center mb-4">Confirmation de Commande</h2>

                <div className="card mb-3">
                    <div className="card-header">
                        Détails de Livraison
                    </div>
                    <div className="card-body">
                        <p className="card-text">{adresse_livraison}</p>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-header">
                        Détails de Paiement
                    </div>
                    <div className="card-body">
                        <p className="card-text">Numéro de Carte: {maskCardNumber(numero_carte)}</p>
                    </div>
                </div>

                <div className="card mb-3">
                    <div className="card-header">
                        Détails des Produits du Panier
                    </div>
                    <div className="card-body">
                        <ul className="list-group list-group-flush">
                            {panierProduits.map((produit, index) => (
                                <li className="list-group-item" key={index}>
                                    <span>{produit.nom} - Quantité: {produit.quantite}</span>
                                    <span className="float-end">{produit.prix} €</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <button className="btn btn-primary d-grid gap-2 col-6 mx-auto" onClick={handleCommandePay}>Payer</button>
            </div>
        </ProtectedRoute>
    );
};

export default ConfirmationCommande;
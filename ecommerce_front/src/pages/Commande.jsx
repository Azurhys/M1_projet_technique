import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCreditCard, faCalendarAlt, faLock } from '@fortawesome/free-solid-svg-icons';

const Commande = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [adresseLivraison, setAdresseLivraison] = useState('');
    const [adresseFacturation, setAdresseFacturation] = useState('');
    const [numeroCarte, setNumeroCarte] = useState('');
    const [dateExpir, setDateExpir] = useState('');
    const [cryptogramme, setCryptogramme] = useState('');
    const [cartItems, setCartItems] = useState([]);
    const [panierId, setPanierId] = useState(null);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCartItems(savedCart);
        fetchPanierId();
    }, []);

    const fetchPanierId = async () => {
        if (!user) return;

        try {
            const response = await fetch(`http://localhost:3000/paniers/user/${user.id_utilisateur}`);
            if (response.ok) {
                const panier = await response.json();
                setPanierId(panier.id_panier);
            } else {
                toast.error("Erreur lors de la récupération du panier");
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la récupération du panier");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            toast.error("Utilisateur non authentifié");
            return;
        }

        const newOrder = {
            id_utilisateur: user.id_utilisateur,
            id_panier: panierId,
            date_commande: new Date().toISOString(),
            nom: nom,
            prenom: prenom,
            adresse_livraison: adresseLivraison,
            adresse_facturation: adresseFacturation,
            numero_carte: numeroCarte,
            date_expir: dateExpir,
            cryptogramme: cryptogramme,
            statut_commande: 'En attente'
        };

        try {
            const response = await fetch('http://localhost:3000/commandes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newOrder),
            });

            if (response.ok) {
                const data = await response.json();
                navigate('/confirmation-commande', { state: { id_commande: data.id_commande } });
            } else {
                toast.error("Erreur lors de la création de la commande");
            }
        } catch (error) {
            console.error('Erreur:', error);
            toast.error("Erreur lors de la création de la commande");
        }
    };

    return (
        <div className="container my-5">
            <h2 className="text-center mb-4">Passer une Commande</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                    <label>Nom</label>
                    <input
                        type="text"
                        className="form-control"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Prénom</label>
                    <input
                        type="text"
                        className="form-control"
                        value={prenom}
                        onChange={(e) => setPrenom(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Adresse de livraison</label>
                    <textarea
                        className="form-control"
                        value={adresseLivraison}
                        onChange={(e) => setAdresseLivraison(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Adresse de facturation</label>
                    <textarea
                        className="form-control"
                        value={adresseFacturation}
                        onChange={(e) => setAdresseFacturation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group mb-3">
                    <label>Numéro de carte</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faCreditCard} />
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            value={numeroCarte}
                            onChange={(e) => setNumeroCarte(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label>Date d'expiration</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faCalendarAlt} />
                            </span>
                        </div>
                        <input
                            type="month"
                            className="form-control"
                            value={dateExpir}
                            onChange={(e) => setDateExpir(e.target.value)}
                            required
                        />
                    </div>
                </div>
                <div className="form-group mb-3">
                    <label>Cryptogramme</label>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <FontAwesomeIcon icon={faLock} />
                            </span>
                        </div>
                        <input
                            type="text"
                            className="form-control"
                            value={cryptogramme}
                            onChange={(e) => setCryptogramme(e.target.value)}
                            required
                            maxLength="3"
                        />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Passer la commande</button>
            </form>
        </div>
    );
};

export default Commande;
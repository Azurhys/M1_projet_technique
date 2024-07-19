import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profile, setProfile] = useState({
    nom: '',
    prenom: '',
    email: '',
    adresse: '',
    telephone: ''
  });
  const [orders, setOrders] = useState([]);
  const { token, updateUser, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        navigate('/'); // Rediriger vers la page de connexion si non authentifié
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await fetch(`http://localhost:3000/commandes/user/${user.id_utilisateur}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [token, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/profile', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profile)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const data = await response.json();
      updateUser(profile); // Mettre à jour le contexte avec les nouvelles informations utilisateur
      alert('Profil mis à jour avec succès');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Erreur lors de la mise à jour du profil');
    }
  };

  return (
    <div className="container my-5">
      <h2>Profil de l'utilisateur</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            className="form-control"
            name="nom"
            value={profile.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Prénom :</label>
          <input
            type="text"
            className="form-control"
            name="prenom"
            value={profile.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={profile.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Adresse :</label>
          <input
            type="text"
            className="form-control"
            name="adresse"
            value={profile.adresse}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Téléphone :</label>
          <input
            type="text"
            className="form-control"
            name="telephone"
            value={profile.telephone}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary my-3">Mettre à jour</button>
      </form>
      
      <h2 className="mt-5">Historique des commandes</h2>
      {orders.length > 0 ? (
        <ul className="list-group">
          {orders.map(order => (
            <li key={order.id_commande} className="list-group-item">
              <p><strong>Date de commande:</strong> {new Date(order.date_commande).toLocaleDateString()}</p>
              <p><strong>Adresse de livraison:</strong> {order.adresse_livraison}</p>
              <p><strong>Adresse de facturation:</strong> {order.adresse_facturation}</p>
              <p><strong>Statut de la commande:</strong> {order.statut_commande}</p>
              <h5>Contenu du panier :</h5>
              <ul>
                {order.panierProduits.map(product => (
                  <li key={product.id_produit}>
                    {product.nom} - {product.quantite} x {product.prix}€ = {product.quantite * product.prix}€
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucune commande trouvée.</p>
      )}
    </div>
  );
};

export default Profile;

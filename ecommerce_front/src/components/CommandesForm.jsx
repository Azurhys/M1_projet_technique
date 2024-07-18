import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:3000/commandes/all', {
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
        navigate('/login'); // Rediriger vers la page de connexion si non authentifié
      }
    };

    fetchOrders();
  }, [token, navigate]);

  const handleStatusChange = async (id_commande, newStatus) => {
    try {
      const response = await fetch(`http://localhost:3000/commandes/${id_commande}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut_commande: newStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      setOrders(orders.map(order => order.id_commande === id_commande ? { ...order, statut_commande: newStatus } : order));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Erreur lors de la mise à jour du statut de la commande');
    }
  };

  const handleDeleteOrder = async (id_commande) => {
    try {
      const response = await fetch(`http://localhost:3000/commandes/${id_commande}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setOrders(orders.filter(order => order.id_commande !== id_commande));
      } else {
        throw new Error('Failed to delete order');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Erreur lors de la suppression de la commande');
    }
  };

  const handleUpdateProductQuantity = async (id_panier, id_produit, newQuantity) => {
    try {
      const response = await fetch(`http://localhost:3000/panierProduits/${id_panier}/${id_produit}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantite: newQuantity })
      });

      if (!response.ok) {
        throw new Error('Failed to update product quantity');
      }

      setOrders(orders.map(order => {
        if (order.id_panier === id_panier) {
          return {
            ...order,
            panierProduits: order.panierProduits.map(product => product.id_produit === id_produit ? { ...product, quantite: newQuantity } : product)
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating product quantity:', error);
      alert('Erreur lors de la mise à jour de la quantité du produit');
    }
  };

  const handleDeleteProduct = async (id_panier, id_produit) => {
    try {
      const response = await fetch(`http://localhost:3000/panierProduits/${id_panier}/${id_produit}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setOrders(orders.map(order => {
        if (order.id_panier === id_panier) {
          return {
            ...order,
            panierProduits: order.panierProduits.filter(product => product.id_produit !== id_produit)
          };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };

  return (
    <ProtectedRoute requiredRole={1}>
      <div className="container my-5">
        <h2>Gestion des commandes</h2>
        {orders.length > 0 ? (
          <ul className="list-group">
            {orders.map(order => (
              <li key={order.id_commande} className="list-group-item my-3">
                <p><strong>Commande ID:</strong> {order.id_commande}</p>
                <p><strong>Date de commande:</strong> {new Date(order.date_commande).toLocaleDateString()}</p>
                <p><strong>Adresse de livraison:</strong> {order.adresse_livraison}</p>
                <p><strong>Adresse de facturation:</strong> {order.adresse_facturation}</p>
                <p><strong>Statut de la commande:</strong> {order.statut_commande}</p>
                <h5>Contenu du panier :</h5>
                <ul>
                  {order.panierProduits.map(product => (
                    <li key={product.id_produit} className="d-flex justify-content-between align-items-center">
                      <span>
                        {product.nom} - {product.quantite} x {product.prix}€ = {product.quantite * product.prix}€
                      </span>
                      <div>
                        
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteProduct(order.id_panier, product.id_produit)}
                        >
                          Supprimer
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="d-flex justify-content-between mt-3">
                  <button
                    className={`btn ${order.statut_commande === 'En attente' ? 'btn-warning' : 'btn-success'}`}
                    onClick={() => handleStatusChange(order.id_commande, order.statut_commande === 'En attente' ? 'Expédiée' : 'En attente')}
                  >
                    {order.statut_commande === 'En attente' ? 'Marquer comme Expédiée' : 'Marquer comme En attente'}
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteOrder(order.id_commande)}
                  >
                    Supprimer la commande
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucune commande trouvée.</p>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default AdminOrders;

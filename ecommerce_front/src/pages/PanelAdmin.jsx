import React from 'react';
import { NavLink } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const AdminDashboard = () => {
  return (
    <ProtectedRoute requiredRole={1}>
      <div className="container my-5 text-center">
        <h2 className="mb-4">Tableau de Bord Administrateur</h2>
        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Gérer les Produits</h5>
                <p className="card-text">Ajouter, modifier ou supprimer des produits.</p>
                <NavLink to="/admin/products" className="btn btn-primary">Accéder</NavLink>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Gérer les Catégories</h5>
                <p className="card-text">Ajouter, modifier ou supprimer des catégories.</p>
                <NavLink to="/admin/categories" className="btn btn-primary">Accéder</NavLink>
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h5 className="card-title">Gérer les Commandes</h5>
                <p className="card-text">Ajouter, modifier ou supprimer des commandes.</p>
                <NavLink to="/admin/commandes" className="btn btn-primary">Accéder</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminDashboard;

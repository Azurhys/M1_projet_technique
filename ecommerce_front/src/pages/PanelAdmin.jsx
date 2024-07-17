import React from 'react';
import { NavLink } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Tableau de Bord Administrateur</h2>
      <ul>
        <button className='btn btn-success mx-2'>
          <NavLink to="/admin/products">Gérer les Produits</NavLink>
        </button>
        <button className='btn btn-success'>
          <NavLink to="/admin/categories">Gérer les Catégories</NavLink>
        </button>
      </ul>
    </div>
  );
};

export default AdminDashboard;

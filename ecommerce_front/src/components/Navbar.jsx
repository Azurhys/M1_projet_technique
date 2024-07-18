import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaHome, FaDollyFlatbed, FaShoppingCart, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '/logo.png';

const Navbar = () => {
    const { auth, user, logout } = useContext(AuthContext);

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container-fluid">
                <NavLink to="/" className="navbar-brand d-flex align-items-center">
                    <img src={logo} alt="Logo" className="me-2" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
                </NavLink>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active fs-4' : 'nav-link fs-4')}>
                                <FaHome className="me-2" /> Accueil
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/articles" className={({ isActive }) => (isActive ? 'nav-link active fs-4' : 'nav-link fs-4')}>
                                <FaDollyFlatbed className="me-2" /> Articles
                            </NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/panier" className={({ isActive }) => (isActive ? 'nav-link active fs-4' : 'nav-link fs-4')}>
                                <FaShoppingCart className="me-2" /> Panier
                            </NavLink>
                        </li>
                        {auth ? (
                            <>
                                <li className="nav-item d-flex align-items-center">
                                    <span className="nav-link fs-4 d-flex align-items-center">
                                        <FaUserCircle className="me-2" /> Bienvenue, {user ? user.prenom : 'Chargement...'}
                                    </span>
                                    <button className="btn btn-outline-light btn-sm ms-3 fs-5" onClick={logout}>
                                        <FaSignOutAlt className="me-1" /> Déconnecter
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <NavLink to="/login" className={({ isActive }) => (isActive ? 'nav-link active fs-4' : 'nav-link fs-4')}>
                                    Se Connecter
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
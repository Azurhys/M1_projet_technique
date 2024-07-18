import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FaHome, FaDollyFlatbed, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
    const { auth, user, logout } = useContext(AuthContext);

    return (
        <div className="bg-sombre mb-0 ">
            <nav className="navbar navbar-expand navbar-dark container ">
                <ul className="navbar-nav nav-fill w-100">
                    <li className="nav-item">
                        <NavLink to="/" className={({ isActive }) => {
                            return isActive ? "nav-link active fs-2" : "nav-link fs-2";
                        }}>
                            <FaHome className="me-2" /> Accueil
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/articles" className={({ isActive }) => {
                            return isActive ? "nav-link active fs-2" : "nav-link fs-2";
                        }}>
                            <FaDollyFlatbed className="me-2" /> Articles
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/panier" className={({ isActive }) => {
                            return isActive ? "nav-link active fs-2" : "nav-link fs-2";
                        }}>
                            <FaShoppingCart className="me-2" /> Panier
                        </NavLink>
                    </li>
                    {auth ? (
                        <>
                            <li className="nav-item">
                                <span className="nav-link fs-2">Bienvenue, {user ? user.prenom : 'Chargement...'}</span>
                            </li>
                            <li className="nav-item">
                                <button className="btn btn-secondary fs-2" onClick={logout}>
                                    Se Déconnecter
                                </button>
                            </li>
                        </>
                    ) : (
                        <li className="nav-item">
                            <NavLink
                                to="/login"
                                className={({ isActive }) => (isActive ? 'nav-link active fs-2' : 'nav-link fs-2')}
                            >
                                Se Connecter
                            </NavLink>
                        </li>
                    )}
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
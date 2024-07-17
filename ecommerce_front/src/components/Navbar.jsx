import { NavLink } from "react-router-dom";
import { FaHome, FaDollyFlatbed , FaSignInAlt, FaShoppingCart } from 'react-icons/fa';

const Navbar = () => {
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
                            <FaDollyFlatbed  className="me-2" /> Articles
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/login" className={({ isActive }) => {
                            return isActive ? "nav-link active fs-2" : "nav-link fs-2";
                        }}>
                            <FaSignInAlt className="me-2" /> Se Connecter
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/panier" className={({ isActive }) => {
                            return isActive ? "nav-link active fs-2" : "nav-link fs-2";
                        }}>
                            <FaShoppingCart className="me-2" /> Panier
                        </NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Navbar;
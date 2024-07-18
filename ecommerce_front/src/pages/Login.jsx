import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Utilisation de useNavigate pour la redirection

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        mot_de_passe: password,
      });

      if (response.status === 200) {
        login(response.data.token);
        navigate('/'); // Redirection vers la page d'accueil après une connexion réussie
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Connexion</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group my-3">
          <label>Mot de passe:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mb-3">Login</button>
        <p className="mt-3">
          Pas de compte ? <NavLink to="/register">Inscrivez-vous !</NavLink>
        </p>
      </form>
    </div>
  );
};

export default Login;

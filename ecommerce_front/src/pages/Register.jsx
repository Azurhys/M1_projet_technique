import React, { useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

const Register = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adresse, setAdresse] = useState('');
  const [telephone, setTelephone] = useState('');
  const [droit, setDroit] = useState(0); // Par défaut, droit à 1 (par exemple utilisateur)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/register', {
        nom: nom,
        prenom: prenom,
        email: email,
        mot_de_passe: password,
        adresse: adresse,
        telephone: telephone,
        droit: droit,
      });

      if (response.status === 201) {
        alert('Inscription réussie');
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Inscription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom:</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div className="form-group my-2">
          <label>Prénom:</label>
          <input
            type="text"
            className="form-control"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            required
          />
        </div>
        <div className="form-group my-2">
          <label>Email:</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group my-2">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group my-2">
          <label>Adresse:</label>
          <input
            type="text"
            className="form-control"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
            required
          />
        </div>
        <div className="form-group my-2">
          <label>Téléphone:</label>
          <input
            type="tel"
            className="form-control"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary my-2">Register</button>
      </form>
      <p className="mt-3">
        Déjà un compte ? <NavLink to="/login">Connectez-vous !</NavLink>
      </p>
    </div>
  );
};

export default Register;

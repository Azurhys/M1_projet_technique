import React from 'react';

const Interdit = () => {
  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <h1 className="card-title text-danger">Accès Interdit</h1>
              <p className="card-text">Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
              <p className="card-text">Veuillez contacter l'administrateur si vous pensez qu'il s'agit d'une erreur.</p>
              <a href="/" className="btn btn-primary">Retour à l'accueil</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interdit;

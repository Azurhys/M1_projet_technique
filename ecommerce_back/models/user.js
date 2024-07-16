class User {
    constructor(id_utilisateur, nom, prenom, email, mot_de_passe, adresse, telephone, droit) {
      this.id_utilisateur = id_utilisateur;
      this.nom = nom;
      this.prenom = prenom;
      this.email = email;
      this.mot_de_passe = mot_de_passe;
      this.adresse = adresse;
      this.telephone = telephone;
      this.droit = droit;
    }
  }
  
  module.exports = User;
  
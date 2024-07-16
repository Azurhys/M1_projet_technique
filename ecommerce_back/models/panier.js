class Cart {
    constructor(id_panier, id_utilisateur, date_creation, statut, total) {
      this.id_panier = id_panier;
      this.id_utilisateur = id_utilisateur;
      this.date_creation = date_creation;
      this.statut = statut;
      this.total = total;
    }
  }

module.exports = Cart;
  
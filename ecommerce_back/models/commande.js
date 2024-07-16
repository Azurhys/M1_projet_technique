class Order {
    constructor(id_commande, id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande) {
      this.id_commande = id_commande;
      this.id_utilisateur = id_utilisateur;
      this.id_panier = id_panier;
      this.date_commande = date_commande;
      this.total = total;
      this.adresse_livraison = adresse_livraison;
      this.adresse_facturation = adresse_facturation;
      this.mode_paiement = mode_paiement;
      this.statut_commande = statut_commande;
    }
  }
  
  module.exports = Order;
  
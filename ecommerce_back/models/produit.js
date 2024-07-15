class Produit {
    constructor(id_produit, nom, description, prix, stock, image_url, id_categorie) {
        this.id_produit = id_produit;
        this.nom = nom;
        this.description = description;
        this.prix = prix;
        this.stock = stock;
        this.image_url = image_url;
        this.id_categorie = id_categorie;
    }
  }
  
  module.exports = Produit;
  
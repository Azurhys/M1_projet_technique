const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('PanierProduit API', () => {
  let chai;
  let token;
  let idPanier = 1;
  let idProduit = 1;

  before(async () => {
    chai = await import('chai');
    try {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          mot_de_passe: 'password123'
        });

      token = loginRes.body.token;
    } catch (err) {
      console.error('Erreur lors de l\'authentification:', err);
      throw err;
    }
  });

  describe('POST /panierProduits', () => {
    it('devrait ajouter un produit au panier', async function() {
      this.timeout(15000); // Extend the timeout for this test
  
      // Wait for a few seconds before running the test
      await new Promise(resolve => setTimeout(resolve, 5000));
  
      const res = await request(app)
        .post('/panierProduits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_panier: idPanier,
          id_produit: idProduit,
          quantite: 2
        });
  
      console.log('Réponse POST /panierProduits:', res.body);
  
      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_panier', idPanier);
      expect(res.body).to.have.property('id_produit', idProduit);
      expect(res.body).to.have.property('quantite', 2);
    });
  });
  

  describe('GET /panierProduits', () => {
    it('devrait récupérer tous les produits des paniers', async () => {
      const res = await request(app)
        .get('/panierProduits')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /panierProduits/:id_panier', () => {
    it('devrait récupérer tous les produits d\'un panier par id_panier', async () => {
      const res = await request(app)
        .get(`/panierProduits/${idPanier}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });

    it('devrait retourner 404 pour un panier inexistant', async () => {
      const res = await request(app)
        .get('/panierProduits/9999')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Aucun produit trouvé dans ce panier');
    });
  });

  describe('PUT /panierProduits/:id_panier/:id_produit', () => {
    it('devrait mettre à jour la quantité d\'un produit dans un panier', async () => {
      const res = await request(app)
        .put(`/panierProduits/${idPanier}/${idProduit}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ quantite: 5 });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('quantite', 5);
    });
  });

  describe('DELETE /panierProduits/:id_panier/:id_produit', () => {
    it('devrait supprimer un produit d\'un panier', async () => {
      const res = await request(app)
        .delete(`/panierProduits/${idPanier}/${idProduit}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(204);
    });
  });
});

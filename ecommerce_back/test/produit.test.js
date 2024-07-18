const request = require('supertest');
const app = require('../app'); 
const db = require('../config/db'); 

describe('Produit API', () => {
  let chai;
  let newProductId;
  let token;

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

  describe('POST /produits', () => {
    it('should create a new product', async () => {
      const res = await request(app)
        .post('/produits')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Produit Test',
          description: 'Description du produit test',
          prix: 100,
          stock: 10,
          image_url: 'http://example.com/image.jpg',
          id_categorie: 1
        });

      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_produit');
      newProductId = res.body.id_produit; 
    });
  });

  describe('GET /produits', () => {
    it('should get all products', async () => {
      const res = await request(app).get('/produits');

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /produits/:id_produit', () => {
    it('should get a single product by id', async () => {
      const res = await request(app).get(`/produits/${newProductId}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_produit', newProductId);
    });

    it('should return 404 for non-existing product', async () => {
      const res = await request(app).get('/produits/9999');

      const expect = chai.expect;
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Produit non trouvé');
    });
  });

  describe('PUT /produits/:id_produit', () => {
    it('should update an existing product', async () => {
      const res = await request(app)
        .put(`/produits/${newProductId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'Produit Test Modifié',
          description: 'Description modifiée',
          prix: 150,
          stock: 5,
          image_url: 'http://example.com/new-image.jpg',
          id_categorie: 2
        });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nom', 'Produit Test Modifié');
    });
  });

  describe('DELETE /produits/:id_produit', () => {
    it('devrait supprimer un produit existant', async () => {
      const res = await request(app)
        .delete(`/produits/${newProductId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(204);
    });
  });
});

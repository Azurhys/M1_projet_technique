const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Categorie API', () => {
  let chai;
  let token;
  let newCategoryId;

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

  describe('POST /categories', () => {
    it('devrait créer une nouvelle catégorie', async () => {
      const res = await request(app)
        .post('/categories')
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Catégorie Test' });

      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_categorie');
      newCategoryId = res.body.id_categorie; 
    });
  });

  describe('GET /categories', () => {
    it('devrait récupérer toutes les catégories', async () => {
      const res = await request(app)
        .get('/categories')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /categories/:id_categorie', () => {
    it('devrait récupérer une catégorie par id', async () => {
      const res = await request(app)
        .get(`/categories/${newCategoryId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_categorie', newCategoryId);
    });

    it('devrait retourner 404 pour une catégorie inexistante', async () => {
      const res = await request(app)
        .get('/categories/9999')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Catégorie non trouvée');
    });
  });

  describe('PUT /categories/:id_categorie', () => {
    it('devrait mettre à jour une catégorie existante', async () => {
      const res = await request(app)
        .put(`/categories/${newCategoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ nom: 'Catégorie Test Modifiée' });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nom', 'Catégorie Test Modifiée');
    });
  });

  describe('DELETE /categories/:id_categorie', () => {
    it('devrait supprimer une catégorie existante', async () => {
      const res = await request(app)
        .delete(`/categories/${newCategoryId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(204);
    });
  });
});

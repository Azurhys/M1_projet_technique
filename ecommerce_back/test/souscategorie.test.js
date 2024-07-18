const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('SousCategory API', () => {
  let chai;
  let token;
  let newSousCategoryId;

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

  describe('POST /souscategories', () => {
    it('devrait créer une nouvelle sous-catégorie', async () => {
      const res = await request(app)
        .post('/souscategories')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'SousCatégorie Test',
          id_categorie: 1
        });

      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_souscategorie');
      newSousCategoryId = res.body.id_souscategorie;
    });
  });

  describe('GET /souscategories', () => {
    it('devrait récupérer toutes les sous-catégories', async () => {
      const res = await request(app)
        .get('/souscategories')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /souscategories/:id_souscategorie', () => {
    it('devrait récupérer une sous-catégorie par id', async () => {
      const res = await request(app)
        .get(`/souscategories/${newSousCategoryId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_souscategorie', newSousCategoryId);
    });

    it('devrait retourner 404 pour une sous-catégorie inexistante', async () => {
      const res = await request(app)
        .get('/souscategories/9999')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Sous-catégorie non trouvée');
    });
  });

  describe('PUT /souscategories/:id_souscategorie', () => {
    it('devrait mettre à jour une sous-catégorie existante', async () => {
      const res = await request(app)
        .put(`/souscategories/${newSousCategoryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'SousCatégorie Test Modifiée',
          id_categorie: 2
        });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nom', 'SousCatégorie Test Modifiée');
    });
  });

  describe('DELETE /souscategories/:id_souscategorie', () => {
    it('devrait supprimer une sous-catégorie existante', async () => {
      const res = await request(app)
        .delete(`/souscategories/${newSousCategoryId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(204);
    });
  });
});

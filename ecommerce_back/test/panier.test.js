const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('Panier API', () => {
  let chai;
  let token;
  let newCartId;

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

  describe('POST /paniers', () => {
    it('devrait créer un nouveau panier', async () => {
      const res = await request(app)
        .post('/paniers')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_utilisateur: 1,
          date_creation: '2024-07-01',
          statut: 'En cours',
          total: 100.0
        });

      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_panier');
      newCartId = res.body.id_panier;
    });
  });

  describe('GET /paniers', () => {
    it('devrait récupérer tous les paniers', async () => {
      const res = await request(app)
        .get('/paniers')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /paniers/:id_panier', () => {
    it('devrait récupérer un panier par id', async () => {
      const res = await request(app)
        .get(`/paniers/${newCartId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_panier', newCartId);
    });

    it('devrait retourner 404 pour un panier inexistant', async () => {
      const res = await request(app)
        .get('/paniers/9999')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Panier non trouvé');
    });
  });

  describe('PUT /paniers/:id_panier', () => {
    it('devrait mettre à jour un panier existant', async () => {
      const res = await request(app)
        .put(`/paniers/${newCartId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_utilisateur: 1,
          date_creation: '2024-07-01',
          statut: 'Terminé',
          total: 150.0
        });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('statut', 'Terminé');
    });
  });

  describe('DELETE /paniers/:id_panier', () => {
    it('devrait supprimer un panier existant', async () => {
      const res = await request(app)
        .delete(`/paniers/${newCartId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(204);
    });
  });
});

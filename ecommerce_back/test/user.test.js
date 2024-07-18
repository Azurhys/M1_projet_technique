const request = require('supertest');
const app = require('../app');
const db = require('../config/db');

describe('User API', () => {
  let chai;
  let token;
  let newUserId;

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

  describe('POST /users', () => {
    it('devrait créer un nouvel utilisateur', async () => {
      const res = await request(app)
        .post('/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'NomTest',
          prenom: 'PrenomTest',
          email: 'test2@example.com',
          mot_de_passe: 'password123',
          adresse: '123 Rue de Test',
          telephone: '1234567890',
          droit: 1
        });

      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_utilisateur');
      newUserId = res.body.id_utilisateur;
    });
  });

  describe('GET /users', () => {
    it('devrait récupérer tous les utilisateurs', async () => {
      const res = await request(app)
        .get('/users')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /users/:id_utilisateur', () => {
    it('devrait récupérer un utilisateur par id', async () => {
      const res = await request(app)
        .get(`/users/${newUserId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_utilisateur', newUserId);
    });

    it('devrait retourner 404 pour un utilisateur inexistant', async () => {
      const res = await request(app)
        .get('/users/9999')
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Utilisateur non trouvé');
    });
  });

  describe('PUT /users/:id_utilisateur', () => {
    it('devrait mettre à jour un utilisateur existant', async () => {
      const res = await request(app)
        .put(`/users/${newUserId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          nom: 'NomTestModifié',
          prenom: 'PrenomTestModifié',
          email: 'testmodifie@example.com',
          mot_de_passe: 'newpassword123',
          adresse: '456 Rue de Modifié',
          telephone: '0987654321',
          droit: 2
        });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('nom', 'NomTestModifié');
    });
  });

  describe('DELETE /users/:id_utilisateur', () => {
    it('devrait supprimer un utilisateur existant', async () => {
      const res = await request(app)
        .delete(`/users/${newUserId}`)
        .set('Authorization', `Bearer ${token}`);

      const expect = chai.expect;
      expect(res.status).to.equal(204);
    });
  });
});

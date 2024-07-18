const request = require('supertest');
const app = require('../app');
const db = require('../config/db');
const chai = require('chai');
const expect = chai.expect;

describe('Commande API', () => {
  let token;
  let newOrderId;

  before(async () => {
    try {
      const loginRes = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          mot_de_passe: 'password123'
        });

      token = loginRes.body.token;

      if (!token) {
        throw new Error('Échec de la connexion: token JWT non reçu');
      }
    } catch (err) {
      console.error('Erreur lors de l\'authentification:', err.message);
      throw err;
    }
  });

  describe('POST /commandes', () => {
    it('devrait créer une nouvelle commande', async () => {
      const res = await request(app)
        .post('/commandes')
        .set('Authorization', `Bearer ${token}`)
        .send({
          id_utilisateur: 1,
          id_panier: 1,
          date_commande: '2024-07-01',
          total: 100.0,
          adresse_livraison: '123 Rue de Test',
          adresse_facturation: '123 Rue de Facturation',
          mode_paiement: 'Carte de crédit',
          statut_commande: 'En attente'
        });

      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_commande');
      newOrderId = res.body.id_commande;
    });
  });

  describe('GET /commandes', () => {
    it('devrait récupérer toutes les commandes', async () => {
      const res = await request(app)
        .get('/commandes')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.above(0);
    });
  });

  describe('GET /commandes/:id_commande', () => {
    it('devrait récupérer une commande par id', async () => {
      const res = await request(app)
        .get(`/commandes/${newOrderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('id_commande', newOrderId);
    });

    it('devrait retourner 404 pour une commande inexistante', async () => {
      const res = await request(app)
        .get('/commandes/9999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(404);
      expect(res.body).to.have.property('message', 'Commande non trouvée');
    });
  });

  describe('PUT /commandes/:id_commande', () => {
    it('devrait mettre à jour une commande existante', async () => {
      const updatedData = {
        date_commande: '2024-07-01',
        adresse_livraison: '456 Rue de Test Modifié',
        adresse_facturation: '456 Rue de Facturation Modifiée',
        statut_commande: 'Expédiée'
      };

      const res = await request(app)
        .put(`/commandes/${newOrderId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedData);

      expect(res.status).to.equal(200);
      expect(res.body).to.include(updatedData);
    });
  });

  describe('DELETE /commandes/:id_commande', () => {
    it('devrait supprimer une commande existante', async () => {
      const res = await request(app)
        .delete(`/commandes/${newOrderId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).to.equal(204);
    });
  });
});
const request = require('supertest');
const app = require('../app'); 

describe('Auth API', () => {
  let chai;

  before(async () => {
    chai = await import('chai');
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          nom: 'Test',
          prenom: 'User',
          email: 'testuser@example.com',
          mot_de_passe: 'password123',
          adresse: '123 Test Street',
          telephone: '1234567890',
          droit: 1
        });

      const expect = chai.expect;
      expect(res.status).to.equal(201);
      expect(res.body).to.have.property('id_utilisateur');
      expect(res.body.email).to.equal('testuser@example.com');
    });

    it('should return 400 if email is already used', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({
          nom: 'Test',
          prenom: 'User',
          email: 'testuser@example.com', // Assuming this email already exists
          mot_de_passe: 'password123',
          adresse: '123 Test Street',
          telephone: '1234567890',
          droit: 1
        });

      const expect = chai.expect;
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email déjà utilisé');
    });
  });

  describe('POST /auth/login', () => {
    it('should login an existing user', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'testuser@example.com',
          mot_de_passe: 'password123'
        });

      const expect = chai.expect;
      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('token');
    });

    it('should return 400 for incorrect email or password', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({
          email: 'wronguser@example.com',
          mot_de_passe: 'wrongpassword'
        });

      const expect = chai.expect;
      expect(res.status).to.equal(400);
      expect(res.body).to.have.property('message', 'Email ou mot de passe incorrect');
    });
  });
});

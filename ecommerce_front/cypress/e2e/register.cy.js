describe('Register Page', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/register');
    });
  
    it('should display the registration form', () => {
      cy.get('h2').should('contain', 'Inscription');
      cy.get('form').should('be.visible');
      cy.get('input[type="text"]').should('have.length', 3); 
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('input[type="tel"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  
    
    it('should register & login successfully with correct details', () => {
    cy.intercept('POST', '**/auth/login').as('loginRequest');    
      cy.get('input[type="text"]').eq(0).type('John');
      cy.get('input[type="text"]').eq(1).type('Doe');
      cy.get('input[type="email"]').type('newuser@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('input[type="text"]').eq(2).type('123 Main St');
      cy.get('input[type="tel"]').type('1234567890');
      cy.get('button[type="submit"]').click();
  
      cy.url().should('eq', 'http://localhost:5173/login');
      cy.on('window:alert', (str) => {
        expect(str).to.equal('Inscription réussie');
      });

      cy.visit('/login');
      cy.get('input[type="email"]').type('newuser@example.com');
      cy.get('input[type="password"]').type('password123');
      cy.get('button[type="submit"]').click();
      cy.wait('@loginRequest').then((interception) => {
        expect(interception.response.statusCode).to.equal(200);
        cy.url().should('eq', 'http://localhost:5173/');
      });
      cy.url().should('eq', 'http://localhost:5173/');
    });

    it('should show an error message if email is already used', () => {
        cy.get('input[type="text"]').eq(0).type('John');
        cy.get('input[type="text"]').eq(1).type('Doe');
        cy.get('input[type="email"]').type('newuser@example.com');
        cy.get('input[type="password"]').type('password123');
        cy.get('input[type="text"]').eq(2).type('123 Main St');
        cy.get('input[type="tel"]').type('1234567890');
        cy.get('button[type="submit"]').click();
    
        cy.on('window:alert', (str) => {
          expect(str).to.equal('Email déjà utilisé');
        });
      });
    
  });
  
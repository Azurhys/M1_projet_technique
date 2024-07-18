describe('Login Page', () => {
    beforeEach(() => {
      cy.visit('/login');
    });
  
    it('should display the login form', () => {
      cy.get('h2').should('contain', 'Connexion');
      cy.get('form').should('be.visible');
      cy.get('input[type="email"]').should('be.visible');
      cy.get('input[type="password"]').should('be.visible');
      cy.get('button[type="submit"]').should('be.visible');
    });
  
    it('should show an error message with incorrect credentials', () => {
      cy.get('input[type="email"]').type('wrong@example.com');
      cy.get('input[type="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();
  

      cy.get('.Toastify__toast-container')
    });
  
    it('should login successfully with correct credentials', () => {
      cy.get('input[type="email"]').type('admin@example.com');
      cy.get('input[type="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
        
      cy.url().should('eq', 'http://localhost:5173/');
    });
  });
  
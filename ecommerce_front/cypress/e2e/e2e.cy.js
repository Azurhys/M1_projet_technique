describe('Scénario d ajout au panier', () => {
  it('passes', () => {
    cy.visit('/')
  })
  it('should register a new user', () => {
    cy.visit('/register');
    cy.get('input[name="nom"]').type('TestNom');
    cy.get('input[name="prenom"]').type('TestPrenom');
    cy.get('input[name="email"]').type('testuser@example.com');
    cy.get('input[name="mot_de_passe"]').type('password123');
    cy.get('input[name="adresse"]').type('123 Rue de Test');
    cy.get('input[name="telephone"]').type('1234567890');
    cy.get('button[type="submit"]').click();
    
    // Check for successful registration
    cy.contains('Registration successful').should('be.visible');
  });
})
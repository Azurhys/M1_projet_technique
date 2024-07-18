describe('Scénario ajout au panier + commande', () => {
    beforeEach(() => {
        cy.visit('/')
    });
  
    it('Commande un article', () => {
        cy.get(':nth-child(2) > .nav-link').click({force: true});
        cy.url().should('eq', 'http://localhost:5173/articles');
        cy.get('.container > :nth-child(2) > :nth-child(1)').click();
        cy.get('.btn').click();
        cy.wait(3000);
        cy.get(':nth-child(4) > .nav-link').click({force: true});
        cy.url().should('eq', 'http://localhost:5173/panier');
        cy.get('.list-group-item')
        cy.get('.mt-5 > .btn').click({force: true});
        cy.get('input[type="email"]').type('admin@example.com');
        cy.get('input[type="password"]').type('admin123');
        cy.get('button[type="submit"]').click();
        cy.get(':nth-child(5) > .nav-link').click({force: true})
        cy.url().should('eq', 'http://localhost:5173/panier')
        cy.get('.mt-5 > .btn').click()
        cy.url().should('eq', 'http://localhost:5173/recap-panier')
        //cy.get('.mt-5 > .btn').click()
    });
    
    
  });
  
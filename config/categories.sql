USE ecommerce;

DROP TABLE IF EXISTS Categorie;

INSERT INTO Categorie (nom, id_categorie_parent) VALUES
('Informatique', NULL),
('Électronique', NULL),
('Appareils Électroménagers', NULL),
('Ordinateurs', 1),
('Smartphones', 1),
('Périphériques', 1),
('Télévisions', 2),
('Audio', 2),
('Réfrigérateurs', 3),
('Lave-linge', 3),
('Cuisine', 3),
('Climatisation', 3),
('Sécurité', 3),
('Réseau', 3),
('Montres', 2),
('Stockage', 1);

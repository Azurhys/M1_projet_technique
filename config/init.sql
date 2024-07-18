DROP DATABASE IF EXISTS ecommerce;

CREATE DATABASE ecommerce;

USE ecommerce;

-- Supprimer la table Produit en premier pour éviter les erreurs de contrainte de clé étrangère
DROP TABLE IF EXISTS Produit;

-- Ensuite, supprimer la table Categorie
DROP TABLE IF EXISTS Categorie;

-- Créer la table Categorie
CREATE TABLE Categorie (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL
);

CREATE TABLE SousCategories (
    id_souscategorie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    id_categorie INT,
    FOREIGN KEY (id_categorie) REFERENCES Categorie(id_categorie)
);





-- Créer la table Produit
CREATE TABLE Produit (
    id_produit INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT,
    prix DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    image_url VARCHAR(255),
    id_categorie INT,
    FOREIGN KEY (id_categorie) REFERENCES Categorie(id_categorie)
);


CREATE TABLE Utilisateur (
    id_utilisateur INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    prenom VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    droit INT NOT NULL
);

-- Table Panier
CREATE TABLE Panier (
    id_panier INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    date_creation DATETIME NOT NULL,
    statut VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur)
);

-- Table Panier_Produit
CREATE TABLE Panier_Produit (
    id_panier INT,
    id_produit INT,
    quantite INT,
    PRIMARY KEY (id_panier, id_produit),
    FOREIGN KEY (id_panier) REFERENCES Panier(id_panier),
    FOREIGN KEY (id_produit) REFERENCES Produit(id_produit)
);

-- Table Commande
CREATE TABLE Commande (
    id_commande INT AUTO_INCREMENT PRIMARY KEY,
    id_utilisateur INT,
    id_panier INT,
    date_commande DATETIME NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    adresse_livraison TEXT NOT NULL,
    adresse_facturation TEXT NOT NULL,
    mode_paiement VARCHAR(50) NOT NULL,
    statut_commande VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateur(id_utilisateur),
    FOREIGN KEY (id_panier) REFERENCES Panier(id_panier)
);

-- Insertion de catégories
INSERT INTO Categorie (nom) VALUES 
('Informatique'),
('Électronique'),
('Appareils Électroménagers');

-- Insertion de sous-catégories
INSERT INTO SousCategories (nom, id_categorie) VALUES 
('Ordinateurs', (SELECT id_categorie FROM Categorie WHERE nom = 'Informatique')),
('Smartphones', (SELECT id_categorie FROM Categorie WHERE nom = 'Informatique')),
('Périphériques', (SELECT id_categorie FROM Categorie WHERE nom = 'Informatique')),
('Télévisions', (SELECT id_categorie FROM Categorie WHERE nom = 'Électronique')),
('Audio', (SELECT id_categorie FROM Categorie WHERE nom = 'Électronique')),
('Réfrigérateurs', (SELECT id_categorie FROM Categorie WHERE nom = 'Appareils Électroménagers')),
('Lave-linge', (SELECT id_categorie FROM Categorie WHERE nom = 'Appareils Électroménagers')),
('Cuisine', (SELECT id_categorie FROM Categorie WHERE nom = 'Appareils Électroménagers')),
('Climatisation', (SELECT id_categorie FROM Categorie WHERE nom = 'Appareils Électroménagers')),
('Sécurité', (SELECT id_categorie FROM Categorie WHERE nom = 'Appareils Électroménagers')),
('Réseau', (SELECT id_categorie FROM Categorie WHERE nom = 'Appareils Électroménagers')),
('Montres', (SELECT id_categorie FROM Categorie WHERE nom = 'Électronique')),
('Stockage', (SELECT id_categorie FROM Categorie WHERE nom = 'Informatique'));

-- Insertion de produits
INSERT INTO Produit (nom, description, prix, stock, image_url, id_categorie) VALUES 
('Ordinateur Portable HP', 'Ordinateur portable HP avec processeur Intel Core i5, 8 Go de RAM et 256 Go de SSD.', 749.99, 50, 'image_url1.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Ordinateurs')),
('Smartphone Samsung Galaxy S21', 'Smartphone Samsung Galaxy S21 avec écran AMOLED 6.2 pouces, 128 Go de stockage.', 999.99, 30, 'image_url2.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Smartphones')),
('Imprimante Canon PIXMA', 'Imprimante tout-en-un Canon PIXMA avec fonctions de copie, numérisation et impression.', 149.99, 20, 'image_url3.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Périphériques')),
('Téléviseur LG OLED 55 pouces', 'Téléviseur LG OLED 4K Ultra HD avec support HDR10 et Dolby Vision.', 1299.99, 15, 'image_url4.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Télévisions')),
('Réfrigérateur Samsung', 'Réfrigérateur Samsung avec technologie No Frost, capacité de 340 litres et classe énergétique A++.', 699.99, 10, 'image_url5.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Réfrigérateurs')),
('Lave-linge Bosch', 'Lave-linge Bosch avec capacité de 8 kg, vitesse d\'essorage de 1400 tr/min et classe énergétique A+++.', 499.99, 25, 'image_url6.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Lave-linge')),
('Micro-ondes Whirlpool', 'Micro-ondes Whirlpool avec 30 litres de capacité, fonction grill et 10 programmes automatiques.', 199.99, 40, 'image_url7.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Cuisine')),
('Casque Audio Sony WH-1000XM4', 'Casque audio sans fil Sony avec réduction de bruit active et autonomie de 30 heures.', 349.99, 35, 'image_url8.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Audio')),
('Tablette Apple iPad Air', 'Tablette Apple iPad Air avec écran Retina de 10.9 pouces, 64 Go de stockage et puce A14 Bionic.', 649.99, 25, 'image_url9.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Ordinateurs')),
('Climatiseur Portable Delonghi', 'Climatiseur portable Delonghi avec puissance de refroidissement de 12000 BTU et télécommande.', 549.99, 10, 'image_url10.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Climatisation')),
('Disque Dur Externe Seagate', 'Disque dur externe Seagate de 2 To avec connectivité USB 3.0.', 89.99, 50, 'image_url11.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Stockage')),
('Machine à Café Nespresso', 'Machine à café Nespresso avec système de capsules et réservoir d\'eau de 1 litre.', 129.99, 20, 'image_url12.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Cuisine')),
('Aspirateur Dyson V11', 'Aspirateur sans fil Dyson V11 avec autonomie de 60 minutes et divers accessoires de nettoyage.', 599.99, 15, 'image_url13.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Périphériques')),
('Écran PC Dell UltraSharp', 'Écran PC Dell UltraSharp de 27 pouces avec résolution 4K et technologie IPS.', 449.99, 20, 'image_url14.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Ordinateurs')),
('Enceinte Bluetooth JBL', 'Enceinte Bluetooth JBL avec 20 heures d\'autonomie et résistance à l\'eau (IPX7).', 99.99, 30, 'image_url15.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Audio')),
('Cuisinière Induction Electrolux', 'Cuisinière à induction Electrolux avec 4 zones de cuisson et four multifonctions de 72 litres.', 799.99, 10, 'image_url16.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Cuisine')),
('Caméra de Sécurité Arlo', 'Caméra de sécurité Arlo avec résolution 1080p, vision nocturne et audio bidirectionnel.', 199.99, 25, 'image_url17.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Sécurité')),
('Routeur Wi-Fi Netgear', 'Routeur Wi-Fi Netgear avec technologie tri-bande et support des dernières normes Wi-Fi 6.', 299.99, 30, 'image_url18.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Réseau')),
('Montre Connectée Fitbit', 'Montre connectée Fitbit avec suivi de la condition physique, GPS intégré et autonomie de 7 jours.', 149.99, 35, 'image_url19.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Montres')),
('Four Micro-ondes Samsung', 'Four micro-ondes Samsung avec technologie de cuisson par convection et capacité de 28 litres.', 229.99, 20, 'image_url20.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Cuisine')),
('Carte Mémoire SanDisk', 'Carte mémoire SanDisk microSDXC de 128 Go avec adaptateur SD.', 29.99, 50, 'image_url21.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Stockage')),
('Tondeuse à Cheveux Philips', 'Tondeuse à cheveux Philips avec 12 réglages de longueur et autonomie de 90 minutes.', 59.99, 25, 'image_url22.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Périphériques')),
('Cafetière Filtre Moulinex', 'Cafetière filtre Moulinex avec capacité de 1.25 litres et fonction maintien au chaud.', 39.99, 40, 'image_url23.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Cuisine')),
('Sèche-cheveux Remington', 'Sèche-cheveux Remington avec moteur AC de 2200 W et 3 réglages de température.', 49.99, 30, 'image_url24.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Périphériques')),
('Chargeur Sans Fil Anker', 'Chargeur sans fil Anker compatible avec la charge rapide Qi et sortie 10W.', 24.99, 50, 'image_url25.jpg', (SELECT id_categorie FROM SousCategories WHERE nom = 'Périphériques'));

-- Insertion d'utilisateurs
INSERT INTO Utilisateur (nom, prenom, email, mot_de_passe, adresse, telephone, droit) VALUES 
('Admin', 'Istrateur', 'admin@example.com', '$2a$10$jCQeBxDzuaTVoS.2dyA3rO3./vuq2eDykwlt8X9nFaGDCa63S4uYG', '123 Admin St', '1234567890', 1),
('Jean', 'Dupont', 'jean.dupont@example.com', '$2a$10$jCQeBxDzuaTVoS.2dyA3rO3./vuq2eDykwlt8X9nFaGDCa63S4uYG', '456 Rue de Paris', '0987654321', 0);

-- Insertion de paniers
INSERT INTO Panier (id_utilisateur, date_creation, statut, total) VALUES 
(1, '2024-07-15 12:00:00', 'En cours', 199.99),
(2, '2024-07-16 13:00:00', 'En cours', 149.99);

-- Insertion de produits dans les paniers
INSERT INTO Panier_Produit (id_panier, id_produit, quantite) VALUES 
(1, (SELECT id_produit FROM Produit WHERE nom = 'Ordinateur Portable HP'), 1),
(1, (SELECT id_produit FROM Produit WHERE nom = 'Casque Audio Sony WH-1000XM4'), 2),
(2, (SELECT id_produit FROM Produit WHERE nom = 'Smartphone Samsung Galaxy S21'), 1),
(2, (SELECT id_produit FROM Produit WHERE nom = 'Imprimante Canon PIXMA'), 1);

-- Insertion de commandes
INSERT INTO Commande (id_utilisateur, id_panier, date_commande, total, adresse_livraison, adresse_facturation, mode_paiement, statut_commande) VALUES 
(1, 1, '2024-07-17 10:00:00', 199.99, '123 Rue de Test', '123 Rue de Facturation', 'Carte de crédit', 'En attente'),
(2, 2, '2024-07-17 11:00:00', 149.99, '456 Rue de Test', '456 Rue de Facturation', 'PayPal', 'En cours');

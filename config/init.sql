USE ecommerce;

SET FOREIGN_KEY_CHECKS = 0;
    
-- Supprimer la table Produit en premier pour éviter les erreurs de contrainte de clé étrangère
DROP TABLE IF EXISTS Produit;

-- Ensuite, supprimer la table Categorie
DROP TABLE IF EXISTS Categorie;

-- Créer la table Categorie
CREATE TABLE Categorie (
    id_categorie INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    id_categorie_parent INT,
    FOREIGN KEY (id_categorie_parent) REFERENCES Categorie(id_categorie)
);

-- Insérer des catégories
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

-- Insérer des produits
INSERT INTO Produit (nom, description, prix, stock, image_url, id_categorie) VALUES
('Ordinateur Portable HP', 'Ordinateur portable HP avec processeur Intel Core i5, 8 Go de RAM et 256 Go de SSD.', 749.99, 50, 'image_url1.jpg', 4),
('Smartphone Samsung Galaxy S21', 'Smartphone Samsung Galaxy S21 avec écran AMOLED 6.2 pouces, 128 Go de stockage.', 999.99, 30, 'image_url2.jpg', 5),
('Imprimante Canon PIXMA', 'Imprimante tout-en-un Canon PIXMA avec fonctions de copie, numérisation et impression.', 149.99, 20, 'image_url3.jpg', 6),
('Téléviseur LG OLED 55 pouces', 'Téléviseur LG OLED 4K Ultra HD avec support HDR10 et Dolby Vision.', 1299.99, 15, 'image_url4.jpg', 7),
('Réfrigérateur Samsung', 'Réfrigérateur Samsung avec technologie No Frost, capacité de 340 litres et classe énergétique A++.', 699.99, 10, 'image_url5.jpg', 9),
('Lave-linge Bosch', 'Lave-linge Bosch avec capacité de 8 kg, vitesse d\'essorage de 1400 tr/min et classe énergétique A+++.', 499.99, 25, 'image_url6.jpg', 10),
('Micro-ondes Whirlpool', 'Micro-ondes Whirlpool avec 30 litres de capacité, fonction grill et 10 programmes automatiques.', 199.99, 40, 'image_url7.jpg', 11),
('Casque Audio Sony WH-1000XM4', 'Casque audio sans fil Sony avec réduction de bruit active et autonomie de 30 heures.', 349.99, 35, 'image_url8.jpg', 8),
('Tablette Apple iPad Air', 'Tablette Apple iPad Air avec écran Retina de 10.9 pouces, 64 Go de stockage et puce A14 Bionic.', 649.99, 25, 'image_url9.jpg', 4),
('Climatiseur Portable Delonghi', 'Climatiseur portable Delonghi avec puissance de refroidissement de 12000 BTU et télécommande.', 549.99, 10, 'image_url10.jpg', 12),
('Disque Dur Externe Seagate', 'Disque dur externe Seagate de 2 To avec connectivité USB 3.0.', 89.99, 50, 'image_url11.jpg', 16),
('Machine à Café Nespresso', 'Machine à café Nespresso avec système de capsules et réservoir d\'eau de 1 litre.', 129.99, 20, 'image_url12.jpg', 11),
('Aspirateur Dyson V11', 'Aspirateur sans fil Dyson V11 avec autonomie de 60 minutes et divers accessoires de nettoyage.', 599.99, 15, 'image_url13.jpg', 3),
('Écran PC Dell UltraSharp', 'Écran PC Dell UltraSharp de 27 pouces avec résolution 4K et technologie IPS.', 449.99, 20, 'image_url14.jpg', 4),
('Enceinte Bluetooth JBL', 'Enceinte Bluetooth JBL avec 20 heures d\'autonomie et résistance à l\'eau (IPX7).', 99.99, 30, 'image_url15.jpg', 8),
('Cuisinière Induction Electrolux', 'Cuisinière à induction Electrolux avec 4 zones de cuisson et four multifonctions de 72 litres.', 799.99, 10, 'image_url16.jpg', 11),
('Caméra de Sécurité Arlo', 'Caméra de sécurité Arlo avec résolution 1080p, vision nocturne et audio bidirectionnel.', 199.99, 25, 'image_url17.jpg', 13),
('Routeur Wi-Fi Netgear', 'Routeur Wi-Fi Netgear avec technologie tri-bande et support des dernières normes Wi-Fi 6.', 299.99, 30, 'image_url18.jpg', 14),
('Montre Connectée Fitbit', 'Montre connectée Fitbit avec suivi de la condition physique, GPS intégré et autonomie de 7 jours.', 149.99, 35, 'image_url19.jpg', 15),
('Four Micro-ondes Samsung', 'Four micro-ondes Samsung avec technologie de cuisson par convection et capacité de 28 litres.', 229.99, 20, 'image_url20.jpg', 11),
('Carte Mémoire SanDisk', 'Carte mémoire SanDisk microSDXC de 128 Go avec adaptateur SD.', 29.99, 50, 'image_url21.jpg', 16),
('Tondeuse à Cheveux Philips', 'Tondeuse à cheveux Philips avec 12 réglages de longueur et autonomie de 90 minutes.', 59.99, 25, 'image_url22.jpg', 3),
('Cafetière Filtre Moulinex', 'Cafetière filtre Moulinex avec capacité de 1.25 litres et fonction maintien au chaud.', 39.99, 40, 'image_url23.jpg', 11),
('Sèche-cheveux Remington', 'Sèche-cheveux Remington avec moteur AC de 2200 W et 3 réglages de température.', 49.99, 30, 'image_url24.jpg', 3),
('Chargeur Sans Fil Anker', 'Chargeur sans fil Anker compatible avec la charge rapide Qi et sortie 10W.', 24.99, 50, 'image_url25.jpg', 3);

SET FOREIGN_KEY_CHECKS = 1;
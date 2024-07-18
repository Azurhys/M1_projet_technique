SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `categorie`;
CREATE TABLE `categorie` (
  `id_categorie` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  PRIMARY KEY (`id_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `categorie` (`id_categorie`, `nom`) VALUES
(1,	'Informatique'),
(3,	'Appareils Électroménagers'),
(4,	'Ordinateurs'),
(5,	'Smartphones'),
(6,	'Périphériques'),
(7,	'Télévisions'),
(8,	'Audio'),
(9,	'Réfrigérateurs'),
(10,	'Lave-linge'),
(11,	'Cuisine'),
(12,	'Climatisation'),
(13,	'Sécurité'),
(14,	'Réseau'),
(15,	'Montres'),
(16,	'Stockage')
ON DUPLICATE KEY UPDATE `id_categorie` = VALUES(`id_categorie`), `nom` = VALUES(`nom`);

DROP TABLE IF EXISTS `commande`;
CREATE TABLE `commande` (
  `id_commande` int(11) NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int(11) DEFAULT NULL,
  `id_panier` int(11) DEFAULT NULL,
  `date_commande` datetime NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `adresse_livraison` text NOT NULL,
  `adresse_facturation` text NOT NULL,
  `numero_carte` varchar(50) NOT NULL,
  `date_expir` varchar(50) NOT NULL,
  `cryptogramme` varchar(50) NOT NULL,
  `statut_commande` varchar(50) NOT NULL,
  PRIMARY KEY (`id_commande`),
  KEY `id_utilisateur` (`id_utilisateur`),
  KEY `id_panier` (`id_panier`),
  CONSTRAINT `commande_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`),
  CONSTRAINT `commande_ibfk_2` FOREIGN KEY (`id_panier`) REFERENCES `panier` (`id_panier`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `commande` (`id_commande`, `id_utilisateur`, `id_panier`, `date_commande`, `nom`, `prenom`, `adresse_livraison`, `adresse_facturation`, `numero_carte`, `date_expir`, `cryptogramme`, `statut_commande`) VALUES
(7,	12,	21,	'2024-07-18 10:15:15',	'DO Vale Pereira',	'Vitor',	'1 impasse victorine',	'1 impasse victorine',	'111222333444555',	'2024-10',	'333',	'payé')
ON DUPLICATE KEY UPDATE `id_commande` = VALUES(`id_commande`), `id_utilisateur` = VALUES(`id_utilisateur`), `id_panier` = VALUES(`id_panier`), `date_commande` = VALUES(`date_commande`), `nom` = VALUES(`nom`), `prenom` = VALUES(`prenom`), `adresse_livraison` = VALUES(`adresse_livraison`), `adresse_facturation` = VALUES(`adresse_facturation`), `numero_carte` = VALUES(`numero_carte`), `date_expir` = VALUES(`date_expir`), `cryptogramme` = VALUES(`cryptogramme`), `statut_commande` = VALUES(`statut_commande`);

DROP TABLE IF EXISTS `panier`;
CREATE TABLE `panier` (
  `id_panier` int(11) NOT NULL AUTO_INCREMENT,
  `id_utilisateur` int(11) DEFAULT NULL,
  `date_creation` datetime NOT NULL,
  `statut` varchar(50) NOT NULL,
  `total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_panier`),
  KEY `id_utilisateur` (`id_utilisateur`),
  CONSTRAINT `panier_ibfk_1` FOREIGN KEY (`id_utilisateur`) REFERENCES `utilisateur` (`id_utilisateur`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `panier` (`id_panier`, `id_utilisateur`, `date_creation`, `statut`, `total`) VALUES
(17,	1,	'2024-07-17 21:02:48',	'En cours',	2099.96),
(21,	12,	'2024-07-18 09:00:27',	'En cours',	6899.92)
ON DUPLICATE KEY UPDATE `id_panier` = VALUES(`id_panier`), `id_utilisateur` = VALUES(`id_utilisateur`), `date_creation` = VALUES(`date_creation`), `statut` = VALUES(`statut`), `total` = VALUES(`total`);

DROP TABLE IF EXISTS `panier_produit`;
CREATE TABLE `panier_produit` (
  `id_panier` int(11) NOT NULL,
  `id_produit` int(11) NOT NULL,
  `quantite` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_panier`,`id_produit`),
  KEY `id_produit` (`id_produit`),
  CONSTRAINT `panier_produit_ibfk_1` FOREIGN KEY (`id_panier`) REFERENCES `panier` (`id_panier`),
  CONSTRAINT `panier_produit_ibfk_2` FOREIGN KEY (`id_produit`) REFERENCES `produit` (`id_produit`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `panier_produit` (`id_panier`, `id_produit`, `quantite`) VALUES
(17,	1,	1),
(17,	2,	6),
(21,	1,	6),
(21,	5,	1)
ON DUPLICATE KEY UPDATE `id_panier` = VALUES(`id_panier`), `id_produit` = VALUES(`id_produit`), `quantite` = VALUES(`quantite`);

DROP TABLE IF EXISTS `produit`;
CREATE TABLE `produit` (
  `id_produit` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `prix` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `id_categorie` int(11) DEFAULT NULL,
  PRIMARY KEY (`id_produit`),
  KEY `id_categorie` (`id_categorie`),
  CONSTRAINT `produit_ibfk_1` FOREIGN KEY (`id_categorie`) REFERENCES `categorie` (`id_categorie`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `produit` (`id_produit`, `nom`, `description`, `prix`, `stock`, `image_url`, `id_categorie`) VALUES
(1,	'Ordinateur Portable HP',	'Ordinateur portable HP avec processeur Intel Core i5, 8 Go de RAM et 256 Go de SSD.',	749.99,	50,	'image_url1.jpg',	4),
(2,	'Smartphone Samsung Galaxy S21',	'Smartphone Samsung Galaxy S21 avec écran AMOLED 6.2 pouces, 128 Go de stockage.',	999.99,	30,	'image_url2.jpg',	5),
(3,	'Imprimante Canon PIXMA',	'Imprimante tout-en-un Canon PIXMA avec fonctions de copie, numérisation et impression.',	149.99,	20,	'image_url3.jpg',	6),
(4,	'Téléviseur LG OLED 55 pouces',	'Téléviseur LG OLED 4K Ultra HD avec support HDR10 et Dolby Vision.',	1299.99,	15,	'image_url4.jpg',	7),
(5,	'Réfrigérateur Samsung',	'Réfrigérateur Samsung avec technologie No Frost, capacité de 340 litres et classe énergétique A++.',	699.99,	10,	'image_url5.jpg',	9),
(6,	'Lave-linge Bosch',	'Lave-linge Bosch avec capacité de 8 kg, vitesse d\'essorage de 1400 tr/min et classe énergétique A+++.',	499.99,	25,	'image_url6.jpg',	10),
(7,	'Micro-ondes Whirlpool',	'Micro-ondes Whirlpool avec 30 litres de capacité, fonction grill et 10 programmes automatiques.',	199.99,	40,	'image_url7.jpg',	11),
(8,	'Casque Audio Sony WH-1000XM4',	'Casque audio sans fil Sony avec réduction de bruit active et autonomie de 30 heures.',	349.99,	35,	'image_url8.jpg',	8),
(9,	'Tablette Apple iPad Air',	'Tablette Apple iPad Air avec écran Retina de 10.9 pouces, 64 Go de stockage et puce A14 Bionic.',	649.99,	25,	'image_url9.jpg',	4),
(10,	'Climatiseur Portable Delonghi',	'Climatiseur portable Delonghi avec puissance de refroidissement de 12000 BTU et télécommande.',	549.99,	10,	'image_url10.jpg',	12),
(11,	'Disque Dur Externe Seagate',	'Disque dur externe Seagate de 2 To avec connectivité USB 3.0.',	89.99,	50,	'image_url11.jpg',	16),
(12,	'Machine à Café Nespresso',	'Machine à café Nespresso avec système de capsules et réservoir d\'eau de 1 litre.',	129.99,	20,	'image_url12.jpg',	11),
(13,	'Aspirateur Dyson V11',	'Aspirateur sans fil Dyson V11 avec autonomie de 60 minutes et divers accessoires de nettoyage.',	599.99,	15,	'image_url13.jpg',	3),
(14,	'Écran PC Dell UltraSharp',	'Écran PC Dell UltraSharp de 27 pouces avec résolution 4K et technologie IPS.',	449.99,	20,	'image_url14.jpg',	4),
(15,	'Enceinte Bluetooth JBL',	'Enceinte Bluetooth JBL avec 20 heures d\'autonomie et résistance à l\'eau (IPX7).',	99.99,	30,	'image_url15.jpg',	8),
(16,	'Cuisinière Induction Electrolux',	'Cuisinière à induction Electrolux avec 4 zones de cuisson et four multifonctions de 72 litres.',	799.99,	10,	'image_url16.jpg',	11),
(17,	'Caméra de Sécurité Arlo',	'Caméra de sécurité Arlo avec résolution 1080p, vision nocturne et audio bidirectionnel.',	199.99,	25,	'image_url17.jpg',	13),
(18,	'Routeur Wi-Fi Netgear',	'Routeur Wi-Fi Netgear avec technologie tri-bande et support des dernières normes Wi-Fi 6.',	299.99,	30,	'image_url18.jpg',	14),
(19,	'Montre Connectée Fitbit',	'Montre connectée Fitbit avec suivi de la condition physique, GPS intégré et autonomie de 7 jours.',	149.99,	35,	'image_url19.jpg',	15),
(20,	'Four Micro-ondes Samsung',	'Four micro-ondes Samsung avec technologie de cuisson par convection et capacité de 28 litres.',	229.99,	20,	'image_url20.jpg',	11),
(21,	'Carte Mémoire SanDisk',	'Carte mémoire SanDisk microSDXC de 128 Go avec adaptateur SD.',	29.99,	50,	'image_url21.jpg',	16),
(22,	'Tondeuse à Cheveux Philips',	'Tondeuse à cheveux Philips avec 12 réglages de longueur et autonomie de 90 minutes.',	59.99,	25,	'image_url22.jpg',	3),
(23,	'Cafetière Filtre Moulinex',	'Cafetière filtre Moulinex avec capacité de 1.25 litres et fonction maintien au chaud.',	39.99,	40,	'image_url23.jpg',	11),
(24,	'Sèche-cheveux Remington',	'Sèche-cheveux Remington avec moteur AC de 2200 W et 3 réglages de température.',	49.99,	30,	'image_url24.jpg',	3),
(25,	'Chargeur Sans Fil Anker',	'Chargeur sans fil Anker compatible avec la charge rapide Qi et sortie 10W.',	24.99,	50,	'image_url25.jpg',	1)
ON DUPLICATE KEY UPDATE `id_produit` = VALUES(`id_produit`), `nom` = VALUES(`nom`), `description` = VALUES(`description`), `prix` = VALUES(`prix`), `stock` = VALUES(`stock`), `image_url` = VALUES(`image_url`), `id_categorie` = VALUES(`id_categorie`);

DROP TABLE IF EXISTS `utilisateur`;
CREATE TABLE `utilisateur` (
  `id_utilisateur` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `mot_de_passe` varchar(255) NOT NULL,
  `adresse` text DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `droit` int(11) NOT NULL,
  PRIMARY KEY (`id_utilisateur`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `utilisateur` (`id_utilisateur`, `nom`, `prenom`, `email`, `mot_de_passe`, `adresse`, `telephone`, `droit`) VALUES
(1,	'Admin',	'User',	'admin@example.com',	'password123',	'123 Admin St, Paris, France',	'1234567890',	1),
(2,	'John',	'Doe',	'amerpillat@gmail.com',	'password123',	'456 User Ave, Paris, France',	'0987654321',	0),
(3,	'Jane',	'Doe',	'jane.doe@example.com',	'password123',	'789 User Blvd, Paris, France',	'1122334455',	0),
(4,	'Alice',	'Smith',	'alice.smith@example.com',	'password123',	'321 User Ln, Paris, France',	'6677889900',	0),
(5,	'Bob',	'Brown',	'bob.brown@example.com',	'password123',	'654 User Rd, Paris, France',	'4455667788',	0),
(6,	'Charlie',	'Johnson',	'charlie.johnson@example.com',	'password123',	'987 User St, Paris, France',	'2233445566',	0),
(7,	'Eve',	'Davis',	'eve.davis@example.com',	'password123',	'159 User Pl, Paris, France',	'7788990011',	0),
(8,	'Mallory',	'Evans',	'mallory.evans@example.com',	'password123',	'753 User Dr, Paris, France',	'3344556677',	0),
(9,	'Trent',	'Miller',	'trent.miller@example.com',	'password123',	'951 User Ct, Paris, France',	'5566778899',	0),
(10,	'Peggy',	'Taylor',	'peggy.taylor@example.com',	'password123',	'147 User Pkwy, Paris, France',	'9988776655',	0),
(11,	'Pereira',	'Hugo',	'hugo.b_pereira@outlook.com',	'$2a$10$tEtR/eHo.g/VG94DYdL3WuTSM3IIvlcNnuNS/zM/nD2RCLFn8PjzW',	'1 impasse victorine',	'0782353410',	0),
(12,	'Pereira',	'Hugo',	'hugo@hugo',	'$2a$10$.7hgbGuZ1.ahCWDBwoqpsuvqkQrYB6zw4JOsMKjLGcxh/CiRBnocO',	'1 impasse victorine',	'0782353410',	0),
(13,	'test',	'test',	'test@test',	'$2a$10$qirQS.xBewMXxtTYDKlwI..xcqMJEcOWesybdmM7aVeCwjEWLDl9a',	'test',	'12345',	0),
(14,	'test',	'test',	'test1@test',	'$2a$10$JfAtJzKStQ5ugiAPITsuq.zY91AF2gFHCKbTK0ZWKaaAb3uzYr3/2',	'test',	'123',	0),
(15,'Admin', 'Istrateur', 'admin@example.com', '$2a$10$jCQeBxDzuaTVoS.2dyA3rO3./vuq2eDykwlt8X9nFaGDCa63S4uYG', '123 Admin St', '1234567890', 1),
(16,'Jean', 'Dupont', 'jean.dupont@example.com', '$2a$10$jCQeBxDzuaTVoS.2dyA3rO3./vuq2eDykwlt8X9nFaGDCa63S4uYG', '456 Rue de Paris', '0987654321', 0)
ON DUPLICATE KEY UPDATE `id_utilisateur` = VALUES(`id_utilisateur`), `nom` = VALUES(`nom`), `prenom` = VALUES(`prenom`), `email` = VALUES(`email`), `mot_de_passe` = VALUES(`mot_de_passe`), `adresse` = VALUES(`adresse`), `telephone` = VALUES(`telephone`), `droit` = VALUES(`droit`);

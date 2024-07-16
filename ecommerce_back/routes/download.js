const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const archiver = require('archiver');
const db = require('../config/db');

// Route pour télécharger les images d'un produit identifié par son ID sous forme de ZIP
router.get('/:productId', async (req, res, next) => {
    let productId = req.params.productId;

    try {
        // Requête pour obtenir les informations du produit
        const [rows] = await db.query('SELECT * FROM Produit WHERE id_produit = ?', [productId]);
        
        // Vérifier si le produit existe
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Produit non trouvé' });
        }

        // Obtenir les détails du produit
        const { nom, description, prix, stock, image_url, id_categorie } = rows[0];

        // Construire le chemin du dossier contenant les images
        let imagesDir = path.resolve(__dirname, '../images');

        // Filtrer les fichiers d'images commençant par l'ID du produit
        let productImages = fs.readdirSync(imagesDir)
                              .filter(file => file.startsWith(productId + '-'));

        // Vérifier si des images ont été trouvées pour ce produit
        if (productImages.length === 0) {
            return res.status(404).send('Aucune image trouvée pour ce produit.');
        }

        // Chemin du dossier temporaire où le fichier ZIP sera créé
        let tempDir = path.resolve(__dirname, '../temp');

        // Vérifier si le dossier temporaire existe, sinon le créer
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }

        // Chemin complet du fichier ZIP à créer
        let zipFilePath = path.resolve(tempDir, `${productId}.zip`);
        let output = fs.createWriteStream(zipFilePath);
        let archive = archiver('zip', {
            zlib: { level: 9 } // Niveau de compression maximal
        });

        // Événement lorsque la création du fichier ZIP est terminée
        output.on('close', () => {
            console.log(`${archive.pointer()} octets totaux`);
            console.log('Fichier ZIP créé avec succès.');

            // Téléchargement du fichier ZIP
            res.download(zipFilePath, `${nom}_${productId}.zip`, (err) => {
                if (err) {
                    console.error('Erreur lors du téléchargement du fichier ZIP :', err);
                    res.status(500).send('Erreur lors du téléchargement du fichier ZIP.');
                }

                // Suppression du fichier ZIP après le téléchargement
                fs.unlinkSync(zipFilePath);
                console.log('Fichier ZIP supprimé après téléchargement.');
            });
        });

        // Gestion des erreurs lors de la création du fichier ZIP
        archive.on('error', (err) => {
            console.error('Erreur lors de la création du fichier ZIP :', err);
            res.status(500).send('Erreur lors de la création du fichier ZIP.');
        });

        // Ajout des fichiers d'images au fichier ZIP
        archive.pipe(output);
        productImages.forEach(image => {
            let imagePath = path.join(imagesDir, image);
            archive.file(imagePath, { name: image });
        });

        // Finalisation de l'archive
        archive.finalize();

    } catch (err) {
        next(err);
    }
});

// Vos autres routes REST pour les produits (POST, PUT, DELETE, GET ALL, GET ONE) ici...

module.exports = router;
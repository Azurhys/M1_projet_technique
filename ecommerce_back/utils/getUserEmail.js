const db = require('../config/db');

const getUserEmail = async (id_utilisateur) => {
  try {
    const [rows] = await db.query('SELECT email FROM Utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
    if (rows.length > 0) {
      return rows[0].email;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user email:', error);
    throw error;
  }
};

module.exports = getUserEmail;

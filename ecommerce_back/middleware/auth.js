const jwt = require('jsonwebtoken');

// Middleware pour vérifier le token et les rôles utilisateur
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('Aucun token fourni');
    return res.status(401).json({ message: 'Accès refusé: aucun token fourni' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('Format de token incorrect');
    return res.status(401).json({ message: 'Accès refusé: format de token incorrect' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token décodé:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log('Token invalide:', err);
    res.status(401).json({ message: 'Accès refusé: token invalide' });
  }
};

module.exports = authMiddleware;

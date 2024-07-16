const checkRole = (requiredRoles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Accès refusé: utilisateur non authentifié' });
      }
  
      const userRole = req.user.role;
  
      if (!requiredRoles.includes(userRole)) {
        return res.status(403).json({ message: `Accès refusé pour le rôle: ${userRole}` });
      }
  
      next();
    };
  };
  
  module.exports = checkRole;
  
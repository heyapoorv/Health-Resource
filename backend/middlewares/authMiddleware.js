// const jwt = require('jsonwebtoken');

// const authMiddleware = (roles = []) => {
//   return (req, res, next) => {
//     const token = req.headers.authorization?.split(' ')[1];
//     if (!token) return res.status(401).json({ message: 'No token provided' });

//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);
//       req.user = decoded;

//       // Role check (if roles are specified)
//       if (roles.length && !roles.includes(decoded.role)) {
//         return res.status(403).json({ message: 'Access denied' });
//       }

//       next();
//     } catch (err) {
//       res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   };
// };

// module.exports = authMiddleware;


const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * authMiddleware - verifies JWT token and optionally checks user roles
 * @param {Array} roles - array of allowed roles (optional)
 */
const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch user from DB excluding password
      const user = await User.findById(decoded.id).select('-password_hash');
      if (!user) return res.status(401).json({ message: 'User not found' });

      req.user = user;

      // Role check
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
};

module.exports = authMiddleware;
